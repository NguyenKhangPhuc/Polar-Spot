import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./app/utils/supabase/proxy";
import { adminRouteProxy } from "./app/middleware/admin_route_proxy";
import { eventResultRoute } from "./app/middleware/event_result_proxy";
import { groupGradingRoute } from "./app/middleware/group_grading_proxy";

/**
 * PURPOSE:
 * Centralized Route Proxy Dispatcher for Polar-Spot.
 * Refreshes session via updateSession, resolves user once, and dispatches to modular
 * route handler proxies inside app/middleware/ based on pathname prefixes.
 *
 * CONTEXT/PARENT FILE:
 * Invoked by middleware.ts at project root.
 *
 * INPUTS / PARAMETERS:
 * - request (NextRequest, Required): Incoming HTTP request object.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
    // 1. Session refresh + shared Supabase client.
    //    updateSession creates the client ONCE and handles auth redirects.
    //    All downstream handlers receive this same client — no re-instantiation.
    const { supabaseResponse, supabase } = await updateSession(request);
    if (supabaseResponse.status !== 200) return supabaseResponse;

    // 2. Resolve the authenticated user ONCE using the shared client.
    //    getUser() makes a single network call to Supabase Auth.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 3. Path-based dispatch.
    //    Each branch only invokes handlers whose route patterns could possibly match.
    const pathname = request.nextUrl.pathname;

    if (
        pathname.startsWith("/events-management") ||
        pathname.startsWith("/groups-management") ||
        pathname.startsWith("/users-management")
    ) {
        const result = await adminRouteProxy({ request, user, supabase });
        if (result.status !== 200) return result;

    } else if (pathname.startsWith("/events/")) {
        const result = await eventResultRoute({ request, user, supabase });
        if (result.status !== 200) return result;

    } else if (pathname.startsWith("/groups/")) {
        const result = await groupGradingRoute({ request, user, supabase });
        if (result.status !== 200) return result;
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};