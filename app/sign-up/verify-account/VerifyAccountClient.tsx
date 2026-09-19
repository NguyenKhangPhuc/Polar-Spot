"use client";

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
            VERIFY ACCOUNT
          </h1>
        </div>
      </div>

      {/* Disabled Email Input */}
      <div className="flex flex-col">
        <label className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest mb-1.5 flex items-center justify-between select-none">
          <span>TARGET EMAIL</span>
          <span className="text-[#83958d] font-bold font-mono">(LOCKED)</span>
        </label>
        <div className="relative flex items-center w-full bg-[#151312]/60 border border-white/5 rounded-sm text-[#83958d]">
          <span className="pl-3.5 text-[#83958d]/50 flex items-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            disabled
            type="text"
            placeholder="Enter your Email"
            className="w-full bg-transparent text-[#83958d] placeholder-[#83958d]/40 text-xs p-3.5 outline-none border-none cursor-not-allowed font-mono"
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

      {/* Received OTP Input */}
      <div className="flex flex-col">
        <label className="text-[9px] font-mono font-bold text-[#83958d] uppercase tracking-widest mb-1.5 flex items-center justify-between select-none">
          <span>RECEIVED OTP CODE</span>
          <span className="text-[#00ffec]">*</span>
        </label>
        <div className="relative flex items-center w-full bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00ffec]/50 transition-all text-[#e8e1df]">
          <span className="pl-3.5 text-[#83958d] flex items-center shrink-0">
            <svg className="w-4 h-4 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </span>
          <input
            type="password"
            placeholder="Enter your Received OTP"
            className="w-full bg-transparent text-[#e8e1df] placeholder-[#83958d]/40 text-xs p-3.5 outline-none border-none font-mono"
            {...register("otp", {
              required: "OTP is required",
            })}
          />
        </div>
        {errors.otp && (
          <p className="text-red-400 text-[9px] font-mono font-medium mt-1 uppercase tracking-wider">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 w-full bg-[#00ffec] text-[#00382b] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#00ffec]/10"
      >
        VERIFY YOUR ACCOUNT
      </button>

      {/* Switch to Sign Up */}
      <p className="text-center text-xs font-mono text-[#83958d] mt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#00ffec] font-bold hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default VerifyAccount;