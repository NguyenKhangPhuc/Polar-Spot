import { ProfileInsert } from "../types/profile";
import { createClient } from "../utils/supabase/server";

export async function updateProfile(profile: ProfileInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id)

    if (error) {
        return { error: "Failed to update profile" }
    }
    return error
}