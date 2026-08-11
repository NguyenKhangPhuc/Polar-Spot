'use server';

import { Event, EventInsert } from "../types/event";
import { createClient } from "../utils/supabase/server";

export async function getAllEvents() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) {
        return { data: null, error: "Fail to fetch events" };
    }
    return { data: data as Event[], error: null };
}

export async function createEvent(event: EventInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (error) {
        return { data: null, error: "Fail to create event" };
    }
    return { data, error: null };
}

export async function updateEvent(event: EventInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('events').update(event).eq('id', event.id!).select().single();
    if (error) {
        return { data: null, error: "Fail to update event" };
    }
    return { data, error: null };
}

export async function deleteEvent(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").delete().eq('id', eventId);
    if (error) {
        return { data: null, error: "Fail to delete event" };
    }
    return { data, error: null };
}
