import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "./app/utils/supabase/proxy"


export async function proxy(request: NextRequest) {
    // 1. Maintenance gate — synchronous, no DB involved.
    // const maintenanceResponse = maintenanceModeCheck(request)
    // if (maintenanceResponse.status !== 200) return maintenanceResponse

    // 2. Session refresh + shared Supabase client.
    //    updateSession creates the client ONCE and handles auth redirects.
    //    All downstream handlers receive this same client — no re-instantiation.
    const { supabaseResponse, supabase } = await updateSession(request)
    if (supabaseResponse.status !== 200) return supabaseResponse

    // 3. Resolve the authenticated user ONCE using the shared client.
    //    getUser() makes a single network call to Supabase Auth.
    const { data: { user } } = await supabase.auth.getUser()

    // 4. Path-based dispatch.
    //    Each branch only invokes handlers whose route patterns could possibly match,
    //    eliminating the prior sequential await-waterfall across all 13 handlers.
    const pathname = request.nextUrl.pathname

    // if (pathname.startsWith('/register/')) {
    //     const result = await registerRoute({ request, user, supabase })
    //     if (result.status !== 200) return result

    // } else if (pathname.startsWith('/submission/')) {
    //     // Order matters: most-specific patterns checked first.
    //     const gradingResult = await submissionGradingRoute({ request, user, supabase })
    //     if (gradingResult.status !== 200) return gradingResult

    //     const readOnlyResult = await submissionReadOnlyRoute({ request, user, supabase })
    //     if (readOnlyResult.status !== 200) return readOnlyResult

    //     const submissionResult = await submissionRoute({ request, user, supabase })
    //     if (submissionResult.status !== 200) return submissionResult

    //     const submissionFeedBackResult = await submissionFeedBack({ request, user, supabase })
    //     if (submissionFeedBackResult.status !== 200) return submissionFeedBackResult

    // } else if (pathname.startsWith('/events/')) {
    //     // All /events/:id/* sub-routes and /events/create live here.
    //     const createResult = await createEventRoute({ request, user, supabase })
    //     if (createResult.status !== 200) return createResult

    //     const groupsResult = await viewAllGroups({ request, user, supabase })
    //     if (groupsResult.status !== 200) return groupsResult

    //     const editResult = await editEventRoute({ request, user, supabase })
    //     if (editResult.status !== 200) return editResult

    //     const gradeResult = await eventSubmissionGradingRoute({ request, user, supabase })
    //     if (gradeResult.status !== 200) return gradeResult

    // } else if (pathname.startsWith('/groups/')) {
    //     const result = await userGroupRoute({ request, user, supabase })
    //     if (result.status !== 200) return result

    // } else if (pathname.startsWith('/projects')) {
    //     const manageResult = await projectsManageRoute({ request, user, supabase })
    //     if (manageResult.status !== 200) return manageResult

    //     const pendingResult = await projectDetailsPendingRoute({ request, user, supabase })
    //     if (pendingResult.status !== 200) return pendingResult

    // } else if (pathname.startsWith('/student/')) {
    //     const result = await studentRoute({ request, user, supabase })
    //     if (result.status !== 200) return result

    // } else if (
    //     pathname.startsWith('/user-management') ||
    //     pathname.startsWith('/group-management') ||
    //     pathname.startsWith('/events-management')
    // ) {
    //     const result = await adminRouteProxy({ request, user, supabase })
    //     if (result.status !== 200) return result
    // }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}