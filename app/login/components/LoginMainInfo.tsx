"use client";

/**
 * PURPOSE:
 * Renders the primary form input fields (Email and Password) for the Login portal,
 * styled using Arctic Cyber-Frost design tokens with focus glow transitions and error handling.
 *
 * CONTEXT/PARENT FILE:
 * Mounted inside 'app/login/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<LoginForm>, Required): React Hook Form register function.
 * - errors (FieldErrors<LoginForm>, Required): React Hook Form field validation errors object.
 */

import { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LoginForm } from "@/app/types/authentication";

interface LoginMainInfoSectionProps {
  register: UseFormRegister<LoginForm>;
  errors: FieldErrors<LoginForm>;
}

const LoginMainInfoSection = ({ register, errors }: LoginMainInfoSectionProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      {/* Email Input Field */}
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

      {/* Password Input Field */}
      <div className="flex flex-col mt-4">
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
    </>
  );
};

export default LoginMainInfoSection;