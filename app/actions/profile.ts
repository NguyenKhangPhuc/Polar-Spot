'use server';

import { Profile, ProfileInsert } from "../types/profile";
import { createClient } from "../utils/supabase/server";

/**
 * PURPOSE:
 * Fetches a user profile record from the database by user ID.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/components/Navbar.tsx or user profile pages.
 *
 * INPUTS / PARAMETERS:
 * - userId (string, Required): Unique identifier of target user.
 */
export async function getProfileById(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        return { data: null, error: "Failed to fetch user profile" };
    }
    return { data: data as (Profile & { role?: string | null }) | null, error: null };
}

/**
 * PURPOSE:
 * Updates an existing user profile record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Called by profile edit components.
 *
 * INPUTS / PARAMETERS:
 * - profile (ProfileInsert, Required): Profile payload containing target id.
 */
export async function updateProfile(profile: ProfileInsert) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id);

    if (error) {
        return { error: "Failed to update profile" };
    }
    return error;
}