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
      <div className="flex flex-col mt-4">
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
    </>
  );
};

export default LoginSubInfoSection;