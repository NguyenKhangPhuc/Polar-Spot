'use server';

import { unstable_cache, revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Event, EventInsert } from "../types/event";
import { EVENT_STATUS } from "../types/enum";
import { createClient } from "../utils/supabase/server";
import { Database } from "../types/database.types";

/**
 * Creates an anonymous Supabase client using public credentials.
 * Independent of user request cookies to safely enable Next.js unstable_cache.
 */
const getPublicSupabase = () =>
    createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

/**
 * Cached public query for all events with column pruning (omitting content).
 * Tagged for targeted revalidation on mutations.
 */
export const getCachedAllEvents = unstable_cache(
    async () => {
        const supabase = getPublicSupabase();
        const { data, error } = await supabase
            .from('events')
            .select('id, title, short_description, status, organized_date, start_date, end_date, location, member_per_groups, poster_path, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch cached events: ${error.message}`);
        }
        return data as Event[];
    },
    ['public-all-events-list'],
    { tags: ['events-list'], revalidate: 60 }
);

/**
 * Cached public query for a single event by ID.
 * Tagged for targeted revalidation on mutations.
 */
export const getCachedEventById = (eventId: string) =>
    unstable_cache(
        async () => {
            const supabase = getPublicSupabase();
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single();

            if (error) {
                throw new Error(`Failed to fetch cached event: ${error.message}`);
            }
            return data as Event;
        },
        [`event-detail-${eventId}`],
        { tags: [`event-${eventId}`, 'events-list'], revalidate: 60 }
    )();

/**
 * PURPOSE:
 * Fetches all events from the database sorted by creation timestamp descending.
 * Uses cached public read with fallback to cookie-aware client if needed.
 */
export async function getAllEvents() {
    try {
        const data = await getCachedAllEvents();
        return { data, error: null };
    } catch {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('events')
            .select('id, title, short_description, status, organized_date, start_date, end_date, location, member_per_groups, poster_path, created_at')
            .order('created_at', { ascending: false });
        if (error) {
            return { data: null, error: "Fail to fetch events" };
        }
        return { data: data as Event[], error: null };
    }
}

/**
 * PURPOSE:
 * Inserts a new event record into the database and revalidates cache.
 */
export async function createEvent(event: EventInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').insert(event as any).select().single();
    if (error) {
        return { data: null, error: "Fail to create event" };
    }
    revalidatePath('/events');
    return { data: data as Event, error: null };
}

/**
 * PURPOSE:
 * Updates an existing event record in the database and revalidates cache.
 */
export async function updateEvent(event: EventInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').update(event as any).eq('id', event.id!).select().single();
    if (error) {
        return { data: null, error: "Fail to update event" };
    }
    revalidatePath('/events');
    if (event.id) {
        revalidatePath(`/events/${event.id}`);
    }
    return { data: data as Event, error: null };
}

// Alias for compatibility with user example
export async function updateEventInfo({ event }: { event: EventInsert }) {
    return updateEvent(event);
}

/**
 * PURPOSE:
 * Updates the status column of a specific event record and revalidates cache.
 */
export async function updateEventStatus(eventId: string, status: EVENT_STATUS) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').update({ status }).eq('id', eventId).select().single();
    if (error) {
        return { data: null, error: "Fail to update event status" };
    }
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    return { data: data as Event, error: null };
}

/**
 * PURPOSE:
 * Deletes an event record from the database and revalidates cache.
 */
export async function deleteEvent(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").delete().eq('id', eventId);
    if (error) {
        return { data: null, error: "Fail to delete event" };
    }
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    return { data, error: null };
}

/**
 * PURPOSE:
 * Fetches single event record by ID using tagged cache with fallback.
 */
export async function getEventById(eventId: string) {
    try {
        const data = await getCachedEventById(eventId);
        return { data, error: null };
    } catch {
        const supabase = await createClient();
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (error) {
            return { data: null, error: "Failed to get event information by event id" };
        }
        return { data: data as Event, error: null };
    }
}

/**
 * PURPOSE:
 * Fetches a single event record by ID for single event view page.
 */
export async function getSingleEventById(eventId: string) {
    return getEventById(eventId);
}

/**
 * PURPOSE:
 * Updates or removes the event poster image in Supabase storage and updates poster_path on the event record.
 */
export async function updateEventPoster({
    eventId,
    posterFile,
    originalPath,
}: {
    eventId: string;
    posterFile: File | null;
    originalPath: string | null;
}) {
    const supabase = await createClient();
    let posterPath: string | null = null;

    if (posterFile != null) {
        posterPath = `${eventId}/${Date.now()}-${posterFile.name}`;

        if (originalPath) {
            await supabase.storage.from('attachments').remove([originalPath]);
        }
        const { error: storageError } = await supabase.storage
            .from('attachments')
            .upload(posterPath, posterFile);

        if (storageError) {
            console.log(storageError);
            return { error: "Failed to upload to storage" };
        }

        const { error } = await supabase
            .from('events')
            .update({ poster_path: posterPath } as any)
            .eq('id', eventId);

        if (error) {
            return { error: "Failed to update image, please contact staff" };
        }
        revalidatePath('/events');
        revalidatePath(`/events/${eventId}`);
        return { error: null };
    }

    if (originalPath) {
        await supabase.storage.from('attachments').remove([originalPath]);
    }
    const { error } = await supabase
        .from('events')
        .update({ poster_path: null } as any)
        .eq('id', eventId);

    if (error) {
        return { error: "Failed to update image, please contact staff" };
    }
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    return { error: null };
}
