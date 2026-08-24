'use server';

import { PROFILE_ROLE } from "../types/enum";
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

/**
 * PURPOSE:
 * Fetches all user profile records from the database ordered by creation date with total count.
 *
 * CONTEXT/PARENT FILE:
 * Called by app/users-management/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export async function getAllUserProfiles() {
    const supabase = await createClient();
    const { data, count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch all user profiles:", error);
        return { data: null, count: 0, error: "Failed to fetch user profiles" };
    }
    return { data: data as Profile[], count: count || 0, error: null };
}

/**
 * PURPOSE:
 * Alias function for getAllUserProfiles for flexibility in invocation naming.
 */
export async function getAllProfile() {
    return getAllUserProfiles();
}

/**
 * PURPOSE:
 * Updates a user's role in their profile record.
 *
 * CONTEXT/PARENT FILE:
 * Called by UserManagementClient in app/users-management/UserManagementClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - userId (string, Required): Target user UUID.
 * - role (string, Required): Target role value (e.g. 'admin', 'judge', 'student').
 */
export async function updateProfileRole(userId: string, role: PROFILE_ROLE) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update profile role:", error);
        return { data: null, error: "Failed to update user role" };
    }
    return { data: data as Profile, error: null };
}