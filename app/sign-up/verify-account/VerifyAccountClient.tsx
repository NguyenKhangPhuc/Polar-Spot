"use client";

/**
 * PURPOSE:
 * Client Component for account OTP verification.
 * Receives email via props, accepts the user's OTP input, triggers account verification via server action,
 * and renders an Arctic Cyber-Frost styled form card.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/sign-up/verify-account/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - email (string, Required): User email passed from search parameters.
 */

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { verifySignUpAccount } from "@/app/actions/authentication";
import { VerifyAccountForm } from "@/app/types/authentication";

export const VerifyAccount = ({ email }: { email: string }) => {
  const { showNotification } = useNotification();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyAccountForm>({
    defaultValues: {
      email,
    },
  });
  const { setIsOpenLoader } = useLoader();

  /**
   * BEHAVIORAL MECHANISM:
   * Submits OTP payload to server action for account verification.
   *
   * PARAMETERS:
   * - userInfo (VerifyAccountForm): Form data containing email and OTP string.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (userInfo: VerifyAccountForm): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const { error } = await verifySignUpAccount(userInfo);
      if (error) {
        throw new Error(error);
      }
      setIsOpenLoader(false);
      showNotification("Verify successfully");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        showNotification(error.message);
      }
      setIsOpenLoader(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#1a3150] border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/80 backdrop-blur-md flex flex-col gap-6 w-full"
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
          VERIFY ACCOUNT
        </h1>
      </div>

      {/* Disabled Email Input */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
          <span>TARGET EMAIL</span>
          <span className="text-slate-400 font-bold">(LOCKED)</span>
        </label>
        <div className="relative flex items-center w-full bg-[#0a1526]/60 border border-white/12 rounded-xl text-slate-400">
          <span className="pl-3.5 text-slate-500 flex items-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            disabled
            type="text"
            placeholder="Enter your Email"
            className="w-full bg-transparent text-slate-400 placeholder-slate-500 text-sm p-3.5 outline-none border-none cursor-not-allowed"
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

      {/* Received OTP Input */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
          <span>RECEIVED OTP CODE</span>
          <span className="text-cyan-400">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#0a1526] border border-white/18 rounded-xl focus-within:border-cyan-400 transition-colors text-white">
          <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </span>
          <input
            type="password"
            placeholder="Enter your Received OTP"
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm p-3.5 outline-none border-none"
            {...register("otp", {
              required: "OTP is required",
            })}
          />
        </div>
        {errors.otp && (
          <p className="text-red-400 text-xs font-medium mt-1">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 w-full bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer shadow-lg"
      >
        VERIFY YOUR ACCOUNT
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
    </form>
  );
};

export default VerifyAccount;