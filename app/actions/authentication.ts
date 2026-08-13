'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { LoginForm, ResetPasswordForm, SignupForm, VerifyAccountForm } from '../types/authentication'
import { AUTH_ERROR_CODE } from '../types/enum'

export async function getUser() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser()
    return { data, error }
}

export async function login(formData: LoginForm) {
    const supabase = await createClient()

    const data = {
        email: formData.email,
        password: formData.password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.code || error.message }
    }

    return { success: true }
}

export async function signup(formData: SignupForm, origin: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: { full_name: formData.fullName, email: formData.email },
            emailRedirectTo: `${origin}/auth/callback`,
        }
    })

    if (error) {
        return { error: error.code || error.message }
    }

    if (data?.user && data.user.identities && data.user.identities.length === 0) {
        return { error: AUTH_ERROR_CODE.EXISTED_USER }
    }

    return { success: true, email: formData.email }
}

export async function signout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.code }
    }
    redirect('/login')
}

export async function resendVerificationCode(email: string, origin: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
            emailRedirectTo: `${origin}/auth/callback`
        }
    })

    if (error) {
        return { data, error: error.code }
    }

    return { data }
}

export async function verifySignUpAccount(verifyAccount: VerifyAccountForm) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp(
        {
            email: verifyAccount.email,
            token: verifyAccount.otp,
            type: 'signup'
        }
    )
    if (error) {
        return { error: 'Fail to verify the OTP' }
    }
    if (data.session == null) {
        return { error: 'Fail to verify the OTP' }
    }
    return { data, error: null }
}

export async function resetPassword(resetPasswordData: ResetPasswordForm) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp(
        {
            email: resetPasswordData.email,
            token: resetPasswordData.otp,
            type: 'email'
        }
    )
    if (error) {
        return { error: 'Fail to verify the OTP' }
    }

    if (data.session == null) {
        return { error: 'Fail to update the user password' }
    }
    const { error: userError } = await supabase.auth.updateUser({ password: resetPasswordData.newPassword })
    if (userError) {
        return { error: 'Fail to update the user password' }
    }
    await supabase.auth.signOut({ scope: 'global' });

    return { error: null }
}