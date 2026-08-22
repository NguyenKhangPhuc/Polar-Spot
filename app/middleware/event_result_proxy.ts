import { NextResponse, type NextRequest } from "next/server";
import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { PROFILE_ROLE } from "../types/enum";

/**
 * PURPOSE:
 * Modular route proxy handler protecting Event Result pages (/events/:id/result).
 * Only permits access to authenticated users with role 'admin' or 'judge'/'judges'.
 *
 * CONTEXT/PARENT FILE:
 * Invoked by proxy.ts at project root when request pathname matches /events/:id/result pattern.
 *
 * INPUTS / PARAMETERS:
 * - params: Object containing request, user, and shared supabase client.
 */
export async function eventResultRoute({
    request,
    user,
    supabase,
}: {
    request: NextRequest;
    user: User | null;
    supabase: SupabaseClient<Database>;
}) {
    const pathname = request.nextUrl.pathname;
    const isResultRoute = /^\/events\/[^/]+\/result(\/.*)?$/.test(pathname);

    if (isResultRoute) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        let userRole: string | null =
            user.user_metadata?.role || user.app_metadata?.role || null;

        if (!userRole) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("role" as any)
                .eq("id", user.id)
                .maybeSingle();

            if (profile && (profile as any).role) {
                userRole = (profile as any).role;
            }
        }

        const roleStr = userRole ? String(userRole).toLowerCase() : "";
        const isAdmin = roleStr === PROFILE_ROLE.ADMIN || roleStr === "admin";
        const isJudge =
            roleStr === PROFILE_ROLE.JUDGES ||
            roleStr === "judge" ||
            roleStr === "judges";

        if (!isAdmin && !isJudge) {
            const url = request.nextUrl.clone();
            url.pathname = "/events";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next({ request });
}
