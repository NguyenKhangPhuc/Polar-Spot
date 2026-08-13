'use server';

import { Event, EventInsert } from "../types/event";
import { EVENT_STATUS } from "../types/enum";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Fetches all events from the database sorted by creation timestamp descending.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/events-management/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export async function getAllEvents() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) {
        return { data: null, error: "Fail to fetch events" };
    }
    return { data: data as Event[], error: null };
}

/**
 * PURPOSE:
 * Inserts a new event record into the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by CreateEventModal component in app/events-management/components/CreateEventModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - event (EventInsert, Required): The event payload to insert into the database.
 */
export async function createEvent(event: EventInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').insert(event as any).select().single();
    if (error) {
        return { data: null, error: "Fail to create event" };
    }
    return { data: data as Event, error: null };
}

/**
 * PURPOSE:
 * Updates an existing event record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by event edit forms.
 *
 * INPUTS / PARAMETERS:
 * - event (EventInsert, Required): Event record data containing the target id.
 */
export async function updateEvent(event: EventInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').update(event as any).eq('id', event.id!).select().single();
    if (error) {
        return { data: null, error: "Fail to update event" };
    }
    return { data: data as Event, error: null };
}

// Alias for compatibility with user example
export async function updateEventInfo({ event }: { event: EventInsert }) {
    return updateEvent(event);
}

/**
 * PURPOSE:
 * Updates the status column of a specific event record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by EventStatusSelect component inside app/events-management/components/EventStatusSelect.tsx.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of the target event.
 * - status (EVENT_STATUS, Required): Target status to update (e.g., ongoing, finished).
 */
export async function updateEventStatus(eventId: string, status: EVENT_STATUS) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').update({ status }).eq('id', eventId).select().single();
    if (error) {
        return { data: null, error: "Fail to update event status" };
    }
    return { data: data as Event, error: null };
}

/**
 * PURPOSE:
 * Deletes an event record from the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by event management delete actions.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of the event to delete.
 */
export async function deleteEvent(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").delete().eq('id', eventId);
    if (error) {
        return { data: null, error: "Fail to delete event" };
    }
    return { data, error: null };
}

/**
 * PURPOSE:
 * Fetches single event record by ID.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/events/[id]/edit/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Target event UUID.
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
 * Updates or removes the event poster image in Supabase storage and updates poster_path on the event record.
 *
 * CONTEXT/PARENT FILE:
 * Called by EditEventClient.tsx in app/events/[id]/edit/EditEventClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing eventId, posterFile, and originalPath.
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
            console.log(storageError)
            return { error: "Failed to upload to storage" };
        }

        const { error } = await supabase
            .from('events')
            .update({ poster_path: posterPath } as any)
            .eq('id', eventId);

        if (error) {
            return { error: "Failed to update image, please contact staff" };
        }
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
    return { error: null };
}