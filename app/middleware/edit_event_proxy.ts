import { NextResponse, type NextRequest } from 'next/server'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { PROFILE_ROLE } from '../types/enum'

export async function editEventRoute({
    request,
    user,
    supabase,
}: {
    request: NextRequest
    user: User | null
    supabase: SupabaseClient<Database>
}) {
    const pathname = request.nextUrl.pathname
    const pathNameSplitted = pathname.split('/')

    if (
        pathNameSplitted.length == 4 &&
        pathNameSplitted[3] == 'edit'
    ) {
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const { data: userRole, error: userRoleError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (userRoleError || userRole?.role != PROFILE_ROLE.ADMIN) {
            const url = request.nextUrl.clone()
            url.pathname = '/events'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next({ request })
}