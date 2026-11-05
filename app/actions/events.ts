'use server';

import { revalidatePath } from "next/cache";
import { Event, EventInsert, EventUpdate } from "../types/event";
import { EVENT_STATUS } from "../types/enum";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Fetches all events from the database sorted by creation timestamp descending.
 */
export async function getAllEvents() {
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

/**
 * PURPOSE:
 * Inserts a new event record into the database and revalidates cache.
 */
export async function createEvent(event: EventInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (error) {
        return { data: null, error: "Fail to create event" };
    }
    revalidatePath('/events');
    return { data, error: null };
}

/**
 * PURPOSE:
 * Updates an existing event record in the database and revalidates cache.
 */
export async function updateEvent(event: EventUpdate) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').update(event).eq('id', event.id!).select().single();
    if (error) {
        return { data: null, error: "Fail to update event" };
    }
    revalidatePath('/events');
    revalidatePath('/events-management');
    if (event.id) {
        revalidatePath(`/events/${event.id}`);
    }
    return { data, error: null };
}

// Alias for compatibility with user example
export async function updateEventInfo({ event }: { event: EventUpdate }) {
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
    revalidatePath('/events-management');
    revalidatePath(`/events/${eventId}`);
    return { data, error: null };
}

/**
 * PURPOSE:
 * Fetches single event record by ID.
 */
export async function getEventById(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
    if (error) {
        return { data: null, error: "Failed to get event information by event id" };
    }
    return { data: data as Event, error: null };
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
            .update({ poster_path: posterPath })
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
        .update({ poster_path: null })
        .eq('id', eventId);

    if (error) {
        return { error: "Failed to update image, please contact staff" };
    }
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    return { error: null };
}
