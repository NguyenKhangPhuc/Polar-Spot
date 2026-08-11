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
    /**
     * BEHAVIORAL MECHANISM:
     * Connects to Supabase client, queries 'events' table ordered by created_at DESC,
     * and returns the events array or sanitized error string.
     *
     * PARAMETERS:
     * None.
     *
     * RETURNS:
     * - Object: { data: Event[] | null, error: string | null }
     */
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
    /**
     * BEHAVIORAL MECHANISM:
     * Inserts the event record into Supabase and returns the created record.
     *
     * PARAMETERS:
     * - event (EventInsert): Event insertion object.
     *
     * RETURNS:
     * - Object: { data: Event | null, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').insert(event).select().single();
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
    /**
     * BEHAVIORAL MECHANISM:
     * Updates matching event record by ID in Supabase and returns the updated record.
     *
     * PARAMETERS:
     * - event (EventInsert): Event update payload containing valid id.
     *
     * RETURNS:
     * - Object: { data: Event | null, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').update(event).eq('id', event.id!).select().single();
    if (error) {
        return { data: null, error: "Fail to update event" };
    }
    return { data: data as Event, error: null };
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
    /**
     * BEHAVIORAL MECHANISM:
     * Executes a targeted column update for 'status' on the matching event ID in Supabase.
     *
     * PARAMETERS:
     * - eventId (string): Target event UUID.
     * - status (EVENT_STATUS): New status enum value.
     *
     * RETURNS:
     * - Object: { data: Event | null, error: string | null }
     */
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
    /**
     * BEHAVIORAL MECHANISM:
     * Removes the event matching eventId from Supabase database.
     *
     * PARAMETERS:
     * - eventId (string): Unique identifier of the event to delete.
     *
     * RETURNS:
     * - Object: { data: any, error: string | null }
     */
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").delete().eq('id', eventId);
    if (error) {
        return { data: null, error: "Fail to delete event" };
    }
    return { data, error: null };
}
