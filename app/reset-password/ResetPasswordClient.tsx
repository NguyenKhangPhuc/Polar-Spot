"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions/authentication";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { ResetPasswordForm } from "@/app/types/authentication";

export const ResetPasswordClient = ({ email }: { email: string }) => {
  const { showNotification } = useNotification();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      email,
    },
  });
  const { setIsOpenLoader } = useLoader();

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const newPasswordValue = useWatch({
    defaultValue: "",
    name: "newPassword",
    control: control,
  });

  const onSubmit = async (userInfo: ResetPasswordForm): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const { error } = await resetPassword(userInfo);
      if (error) {
        throw new Error(error);
      }
      setIsOpenLoader(false);
      showNotification("Update successfully");
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
      className="bg-[#121212] border border-white/12 rounded-md p-6 sm:p-8 shadow-2xl flex flex-col gap-6 w-full"
    >
      {/* Header Title & Brand Logo */}
      <div className="flex flex-col items-center text-center gap-2 border-b border-white/12 pb-5">
        <div className="w-12 h-12 rounded-md bg-[#050505] border border-white/20 p-2 flex items-center justify-center shadow-lg">
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
          RESET PASSWORD
        </h1>
      </div>

      {/* Disabled Email Input */}
      <div className="flex flex-col">
        <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
          <span>TARGET EMAIL</span>
          <span className="text-slate-400 font-bold font-mono">(LOCKED)</span>
        </label>
        <div className="relative flex items-center w-full bg-[#050505]/60 border border-white/12 rounded-md text-slate-400">
          <span className="pl-3.5 text-slate-500 flex items-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            disabled
            type="text"
            placeholder="Enter your Email"
            className="w-full bg-transparent text-slate-400 placeholder-slate-500 text-xs p-3.5 outline-none border-none cursor-not-allowed font-mono"
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
          <p className="text-red-400 text-xs font-mono font-medium mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Received OTP Input */}
      <div className="flex flex-col">
        <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
          <span>RECEIVED OTP CODE</span>
          <span className="text-[#3be1fe]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
          <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
            <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </span>
          <input
            type="password"
            placeholder="Enter your Received OTP"
            className="w-full bg-transparent text-white placeholder-slate-500 text-xs p-3.5 outline-none border-none font-mono"
            {...register("otp", {
              required: "OTP is required",
            })}
          />
        </div>
        {errors.otp && (
          <p className="text-red-400 text-xs font-mono font-medium mt-1">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* New Password Input */}
      <div className="flex flex-col">
        <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
          <span>NEW PASSWORD</span>
          <span className="text-[#3be1fe]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
          <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
            <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter your New Password"
            className="w-full bg-transparent text-white placeholder-slate-500 text-xs p-3.5 outline-none border-none font-mono"
            {...register("newPassword", {
              required: "New Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="pr-3.5 text-slate-400 hover:text-white transition-colors focus:outline-none flex items-center shrink-0 cursor-pointer"
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? (
              <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        {errors.newPassword && (
          <p className="text-red-400 text-xs font-mono font-medium mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm New Password Input */}
      <div className="flex flex-col">
        <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between select-none">
          <span>CONFIRM NEW PASSWORD</span>
          <span className="text-[#3be1fe]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#050505] border border-white/15 rounded-md focus-within:border-[#3be1fe]/70 transition-colors text-white">
          <span className="pl-3.5 text-slate-400 flex items-center shrink-0">
            <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            className="w-full bg-transparent text-white placeholder-slate-500 text-xs p-3.5 outline-none border-none font-mono"
            {...register("confirmedNewPassword", {
              required: "Confirm New Password Required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              validate: (val: string) => {
                if (newPasswordValue !== val) {
                  return "Password does not match";
                }
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="pr-3.5 text-slate-400 hover:text-white transition-colors focus:outline-none flex items-center shrink-0 cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <svg className="w-4 h-4 text-[#3be1fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        {errors.confirmedNewPassword && (
          <p className="text-red-400 text-xs font-mono font-medium mt-1">
            {errors.confirmedNewPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 w-full bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-md transition-colors cursor-pointer shadow-lg"
      >
        UPDATE PASSWORD
      </button>

      {/* Switch to Sign Up */}
      <p className="text-center text-xs text-slate-300 mt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#3be1fe] font-bold hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordClient;