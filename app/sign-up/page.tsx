"use client";

/**
 * PURPOSE:
 * Client Component representing the Sign Up portal.
 * Registers new user accounts, handles terms acceptance validation, triggers OAuth flow,
 * and renders an Arctic Cyber-Frost themed sign-up form card matching the Login portal.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/sign-up/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { useNotification } from "../context/NotificationContext";
import { AUTH_ERROR_CODE } from "../types/enum";
import { useLoader } from "../context/LoaderContext";
import { signup } from "../actions/authentication";
import { SignupForm } from "../types/authentication";

const Home = () => {
  const { showNotification } = useNotification();
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupForm>();
  const { setIsOpenLoader } = useLoader();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers user sign-up action and handles verification navigation or error reports.
   *
   * PARAMETERS:
   * - signupInfo (SignupForm): Form values payload.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (signupInfo: SignupForm): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const res = await signup(signupInfo, window.location.origin);
      if (res?.error) {
        if (
          res.error === AUTH_ERROR_CODE.EXISTED_USER ||
          res.error === "user_already_exists"
        ) {
          showNotification("User already existed");
        } else {
          showNotification(res.error || "Fail to sign up");
        }
        setIsOpenLoader(false);
        return;
      }

      showNotification("Sign up successfully, please verify your email");
      setIsOpenLoader(false);
      router.push(`/sign-up/verify-account?email=${signupInfo.email}`);
    } catch {
      showNotification("Fail to sign up");
      setIsOpenLoader(false);
    }
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Initiates Github OAuth flow after validating Terms & Conditions acceptance.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleLoginWithGithub = async (): Promise<void> => {
    const isAcceptedTerm = getValues("isTermAccepted");
    if (isAcceptedTerm) {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } else {
      showNotification("Please accept the terms conditions and privacy policy");
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
              CREATE ACCOUNT
            </h1>
          </div>

          {/* Full Name Input */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
              <span>FULL NAME</span>
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#0a1526] border border-white/18 rounded-xl focus-within:border-cyan-400 transition-colors text-white">
              <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Enter your Full Name"
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm p-3.5 outline-none border-none"
                {...register("fullName", {
                  required: "Full name is required",
                })}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-400 text-xs font-medium mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Address Input */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
              <span>EMAIL ADDRESS</span>
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
                placeholder="Enter your email address"
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

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
              <span>PASSWORD</span>
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#0a1526] border border-white/18 rounded-xl focus-within:border-cyan-400 transition-colors text-white">
              <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm p-3.5 outline-none border-none"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="pr-3.5 text-slate-400 hover:text-white transition-colors focus:outline-none flex items-center shrink-0 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-3.21 3.21 0 010 4.542M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-cyan-400 bg-[#0a1526] border border-white/18 rounded-md"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forget-password"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex flex-col">
            <div className="flex items-start space-x-2.5">
              <input
                type="checkbox"
                id="isTermAccepted"
                className="mt-0.5 h-4 w-4 cursor-pointer accent-cyan-400 bg-[#0a1526] border border-white/18 rounded-md shrink-0"
                {...register("isTermAccepted", {
                  required: "You must accept the Terms and Privacy Policy to continue",
                })}
              />
              <label
                htmlFor="isTermAccepted"
                className="text-xs text-slate-300 cursor-pointer leading-relaxed select-none"
              >
                I have read and agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="text-cyan-400 underline font-semibold hover:text-cyan-300 transition-colors"
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="text-cyan-400 underline font-semibold hover:text-cyan-300 transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {errors.isTermAccepted && (
              <p className="text-red-400 text-xs font-medium mt-1">
                {errors.isTermAccepted.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer shadow-lg"
          >
            SIGN UP
          </button>

          {/* Switch to Sign In */}
          <p className="text-center text-xs text-slate-300 mt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan-400 font-bold hover:underline transition-colors"
            >
              Sign In
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
            <span>SIGN UP WITH GITHUB</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;