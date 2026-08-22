"use client";

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
      <div className="flex items-center justify-between mt-4 text-xs font-mono">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer accent-[#3be1fe] bg-[#050505] border border-white/15 rounded-md"
          />
          <span>Remember me</span>
        </label>
        <Link
          href="/forget-password"
          className="text-[#3be1fe] hover:text-white font-bold transition-colors cursor-pointer"
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
            className="mt-0.5 h-4 w-4 cursor-pointer accent-[#3be1fe] bg-[#050505] border border-white/15 rounded-md shrink-0"
            {...register("isTermAccepted", {
              required: "You must accept the Terms and Privacy Policy to continue",
            })}
          />
          <label
            htmlFor="isTermAccepted"
            className="text-xs text-slate-300 cursor-pointer leading-relaxed select-none font-sans"
          >
            I have read and agree to the{" "}
            <Link
              href="/terms-and-conditions"
              target="_blank"
              className="text-[#3be1fe] underline font-semibold hover:text-white transition-colors"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              className="text-[#3be1fe] underline font-semibold hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {errors.isTermAccepted && (
          <p className="text-red-400 text-xs font-mono font-medium mt-1">
            {errors.isTermAccepted.message}
          </p>
        )}
      </div>
    </>
  );
};

export default LoginSubInfoSection;