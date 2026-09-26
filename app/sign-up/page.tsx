"use client";

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
import BackButton from "../components/BackButton";

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

  const handleLoginWithGoogle = async (): Promise<void> => {
    const isAcceptedTerm = getValues("isTermAccepted");
    if (isAcceptedTerm) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } else {
      showNotification("Please accept the terms conditions and privacy policy");
    }
  };

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
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      <div className="w-full max-w-md flex flex-col gap-2">
        {/* Back Button */}
        <BackButton href="/login" label="BACK TO LOGIN" className="mb-0" />

        {/* Auth Form Container Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 shadow-2xl flex flex-col gap-5 w-full"
        >
          {/* Header Title & Brand Logo */}
          <div className="flex flex-col items-center text-center gap-3 border-b border-white/5 pb-5">
            <div className="w-12 h-12 rounded-sm bg-[#151312] border border-white/10 p-2 flex items-center justify-center shadow-lg">
              <Image
                src="/polarbear-logo.png"
                alt="Polar Bear Pitching Logo"
                width={36}
                height={36}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-[3px] h-3 bg-[#00ffec]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                CREATE ACCOUNT
              </h1>
            </div>
          </div>

          {/* Full Name Input */}
          <div className="flex flex-col">
            <label className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest mb-1.5 flex items-center justify-between select-none">
              <span>FULL NAME</span>
              <span className="text-[#00ffec]">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00ffec]/50 transition-all text-[#e8e1df]">
              <span className="pl-3.5 text-[#83958d] flex items-center shrink-0">
                <svg className="w-4 h-4 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Enter your Full Name"
                className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 text-xs p-3.5 outline-none border-none font-mono"
                {...register("fullName", {
                  required: "Full name is required",
                })}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-400 text-[9px] font-mono font-medium mt-1 uppercase tracking-wider">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Address Input */}
          <div className="flex flex-col">
            <label className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest mb-1.5 flex items-center justify-between select-none">
              <span>EMAIL ADDRESS</span>
              <span className="text-[#00ffec]">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00ffec]/50 transition-all text-[#e8e1df]">
              <span className="pl-3.5 text-[#83958d] flex items-center shrink-0">
                <svg className="w-4 h-4 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Enter your email address"
                className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 text-xs p-3.5 outline-none border-none font-mono"
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
              <p className="text-red-400 text-[9px] font-mono font-medium mt-1 uppercase tracking-wider">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest mb-1.5 flex items-center justify-between select-none">
              <span>PASSWORD</span>
              <span className="text-[#00ffec]">*</span>
            </label>
            <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00ffec]/50 transition-all text-[#e8e1df]">
              <span className="pl-3.5 text-[#83958d] flex items-center shrink-0">
                <svg className="w-4 h-4 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 text-xs p-3.5 outline-none border-none font-mono"
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
                className="pr-3.5 text-[#83958d] hover:text-[#e8e1df] transition-colors focus:outline-none flex items-center shrink-0 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-3.21 3.21 0 010 4.542M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[#83958d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-[9px] font-mono font-medium mt-1 uppercase tracking-wider">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-mono">
            <label className="flex items-center gap-2 text-[#83958d] cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 cursor-pointer accent-[#00ffec] bg-[#151312] border border-white/10 rounded-sm"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forget-password"
              className="text-[#00ffec] hover:underline font-bold transition-colors cursor-pointer"
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
                className="mt-0.5 h-3.5 w-3.5 cursor-pointer accent-[#00ffec] bg-[#151312] border border-white/10 rounded-sm shrink-0"
                {...register("isTermAccepted", {
                  required: "You must accept the Terms and Privacy Policy to continue",
                })}
              />
              <label
                htmlFor="isTermAccepted"
                className="text-xs text-[#83958d] cursor-pointer leading-relaxed select-none font-mono"
              >
                I have read and agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="text-[#00ffec] underline font-semibold hover:text-[#00ffec]/80 transition-colors"
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="text-[#00ffec] underline font-semibold hover:text-[#00ffec]/80 transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {errors.isTermAccepted && (
              <p className="text-red-400 text-[9px] font-mono font-medium mt-1 uppercase tracking-wider">
                {errors.isTermAccepted.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-[#00ffec] text-[#00382b] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#00ffec]/10"
          >
            SIGN UP
          </button>

          {/* Switch to Sign In */}
          <p className="text-center text-xs font-mono text-[#83958d] mt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#00ffec] font-bold hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleLoginWithGoogle}
              className="w-full flex items-center justify-between px-4 bg-[#151312] border border-[#00ffec]/30 text-[#e8e1df] hover:border-[#00ffec] font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-sm transition-all cursor-pointer shadow-sm shadow-[#00ffec]/5"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#00ffec] fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span className="whitespace-nowrap">SIGN UP WITH GOOGLE</span>
              </div>
              <span className="shrink-0 text-[8px] font-mono text-[#00ffec] bg-[#00ffec]/10 border border-[#00ffec]/30 px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">
                RECOMMENDED
              </span>
            </button>

            <button
              type="button"
              onClick={handleLoginWithGithub}
              className="w-full flex items-center justify-center gap-3 bg-[#151312] border border-white/10 text-[#e8e1df] hover:border-[#00ffec]/50 font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-sm transition-all cursor-pointer shadow-md"
            >
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>SIGN UP WITH GITHUB</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;