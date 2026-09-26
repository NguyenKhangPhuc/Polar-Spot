import { NextResponse, type NextRequest } from 'next/server'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { EVENT_STATUS, PROFILE_ROLE } from '../types/enum'

export async function viewAllGroups({
    request,
    user,
    supabase,
}: {
    request: NextRequest
    user: User | null
    supabase: SupabaseClient<Database>
}) {
    const pathname = request.nextUrl.pathname
    const pathnameSplitted = pathname.split('/')

    if (
        pathnameSplitted.length == 4 &&
        pathnameSplitted[3] == 'groups'
    ) {
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const eventId = pathnameSplitted[2]

        const { data: userRole, error: userRoleError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (userRoleError) {
            const url = request.nextUrl.clone()
            url.pathname = '/events'
            return NextResponse.redirect(url)
        }

        // const { data: eventInfo, error: eventError } = await supabase
        //     .from('events')
        //     .select('status')
        //     .eq('id', eventId)
        //     .single()

        // if (eventError || eventInfo == null) {
        //     const url = request.nextUrl.clone()
        //     url.pathname = '/events'
        //     return NextResponse.redirect(url)
        // }

        // if (eventInfo.status != EVENT_STATUS.FINISHED) {
        if (userRole?.role == PROFILE_ROLE.STUDENT) {
            const url = request.nextUrl.clone()
            url.pathname = '/events'
            return NextResponse.redirect(url)
        }
        // }
    }

    return NextResponse.next({ request })
}