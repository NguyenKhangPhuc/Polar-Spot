import { EventInsert } from "../types/event";
import { createClient } from "../utils/supabase/server";


export async function createEvent(event: EventInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('events').insert(event)
    if (error) {
        return { error: "Fail to create the event" }
    }
    return { data, error }
}

export async function updateEvent(event: EventInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('events').update(event).eq('id', event.id!)
    if (error) {
        return { error: "Failed to update the data" }
    }
    return { data, error }
}

export async function deleteEvent(eventId: string) {
    const supabse = await createClient()
    const { data, error } = await supabse.from("events").delete().eq('id', eventId)
    if (error) {
        return { error: "Failed to update the event" }
    }
    return { data, error }
}

