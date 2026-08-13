"use client";

/**
 * PURPOSE:
 * Client Component for requesting password reset OTP emails.
 * Sends reset password OTP to specified user email via Supabase Auth,
 * and renders an Arctic Cyber-Frost themed form card matching Login and Sign Up.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/forget-password/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { useNotification } from "../context/NotificationContext";
import { useLoader } from "../context/LoaderContext";
import { LoginForm } from "../types/authentication";

const Home = () => {
  const { showNotification } = useNotification();
  const supabase = createClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const { setIsOpenLoader } = useLoader();

  /**
   * BEHAVIORAL MECHANISM:
   * Initiates Github OAuth flow.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleLoginWithGithub = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Sends password reset OTP for target email address.
   *
   * PARAMETERS:
   * - userInfo (LoginForm): Form data payload containing target email.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (userInfo: LoginForm): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userInfo.email);
      if (error) {
        throw new Error("Failed to send the verification code");
      }
      showNotification("Send OTP code successfully");
      setIsOpenLoader(false);
      router.push(`/reset-password?email=${userInfo.email}`);
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message);
      }
      setIsOpenLoader(false);
    }
  };

  return (
    <div className="w-full min-h-screen polar-snow-bg text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 select-none font-sans relative">
      <div className="w-full max-w-xl space-y-6">
        {/* Auth Form Container Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#1a3150] border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/80 backdrop-blur-md flex flex-col gap-6"
        >
          {/* Back to Sign In Link */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors pb-3 border-b border-white/12 cursor-pointer"
          >
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to sign in</span>
          </Link>

          {/* Header Title & Brand Logo */}
          <div className="flex flex-col items-center text-center gap-2 border-b border-white/12 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#0a1526] border border-white/20 p-2 flex items-center justify-center shadow-lg">
              <Image
                src="/polarbear-logo.png"
                alt="Polar Bear Pitching Logo"
                width={36}
                height={36}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight mt-1">
              FORGOT PASSWORD
            </h1>
          </div>

          {/* Email Address Input */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
              <span>ACCOUNT EMAIL</span>
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#0a1526] border border-white/18 rounded-xl focus-within:border-cyan-400 transition-colors text-white">
              <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Enter your registered email"
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm p-3.5 outline-none border-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid Email Format",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer shadow-lg"
          >
            SEND OTP
          </button>

          {/* Switch to Sign Up */}
          <p className="text-center text-xs text-slate-300 mt-1">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-cyan-400 font-bold hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-1">
            <div className="flex-1 h-px bg-white/12" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-white/12" />
          </div>

          {/* OAuth Github Button */}
          <button
            type="button"
            onClick={handleLoginWithGithub}
            className="w-full flex items-center justify-center gap-3 bg-[#0a1526] border border-white/18 text-slate-200 hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors cursor-pointer shadow-md"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>SIGN IN WITH GITHUB</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;