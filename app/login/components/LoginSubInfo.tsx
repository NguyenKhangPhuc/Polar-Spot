"use client";

/**
 * PURPOSE:
 * Renders auxiliary form options (Remember me, Forgot password link, and Terms/Privacy checkboxes)
 * for the Login portal, styled with Arctic Cyber-Frost design tokens.
 *
 * CONTEXT/PARENT FILE:
 * Mounted inside 'app/login/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<LoginForm>, Required): React Hook Form register function.
 * - errors (FieldErrors<LoginForm>, Required): React Hook Form field validation errors object.
 */

import { LoginForm } from "@/app/types/authentication";
import Link from "next/link";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface LoginSubInfoSectionProps {
  register: UseFormRegister<LoginForm>;
  errors: FieldErrors<LoginForm>;
}

const LoginSubInfoSection = ({ register, errors }: LoginSubInfoSectionProps) => {
  return (
    <>
      {/* Remember me & Forgot password link */}
      <div className="flex items-center justify-between mt-4 text-xs">
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
      <div className="flex flex-col mt-4">
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
    </>
  );
};

export default LoginSubInfoSection;