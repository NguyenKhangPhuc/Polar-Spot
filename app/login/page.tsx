"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { useNotification } from "../context/NotificationContext";
import { AUTH_ERROR_CODE } from "../types/enum";
import { useLoader } from "../context/LoaderContext";
import { login, resendVerificationCode } from "../actions/authentication";
import { LoginForm } from "../types/authentication";
import LoginMainInfoSection from "./components/LoginMainInfo";
import LoginSubInfoSection from "./components/LoginSubInfo";

const Home = () => {
  const { showNotification } = useNotification();
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginForm>();
  const { setIsOpenLoader } = useLoader();
  const router = useRouter();

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

  const onSubmit = async (userInfo: LoginForm): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const res = await login(userInfo);
      if (res?.error) {
        if (
          res.error === AUTH_ERROR_CODE.EMAIL_NOT_CONFIRMED ||
          res.error === "email_not_confirmed"
        ) {
          try {
            await resendVerificationCode(userInfo.email, window.location.origin);
            showNotification("Please verify your email");
            router.push(`/sign-up/verify-account?email=${userInfo.email}`);
          } catch {
            showNotification("Failed to send verification code");
          }
        } else if (
          res.error === AUTH_ERROR_CODE.INVALID_CREDENTIALS ||
          res.error === "invalid_credentials"
        ) {
          showNotification("Invalid credentials");
        } else {
          showNotification("Failed to login");
        }
        setIsOpenLoader(false);
        return;
      }

      showNotification("Login successfully");
      setIsOpenLoader(false);
      router.push("/");
    } catch {
      showNotification("Failed to login");
      setIsOpenLoader(false);
    }
  };

  return (
    <div className="w-full min-h-screen polar-snow-bg text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 select-none font-sans relative">
      <div className="w-full max-w-md space-y-6">
        {/* Auth Form Container Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#121212] border border-white/12 rounded-md p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
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
              SIGN IN
            </h1>
          </div>

          {/* Form Inputs */}
          <LoginMainInfoSection register={register} errors={errors} />
          <LoginSubInfoSection register={register} errors={errors} />

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-md transition-colors cursor-pointer shadow-lg"
          >
            SIGN IN
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-1">
            <div className="flex-1 h-px bg-white/12" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-white/12" />
          </div>

          {/* OAuth Github Button */}
          <button
            type="button"
            onClick={handleLoginWithGithub}
            className="w-full flex items-center justify-center gap-3 bg-[#050505] border border-white/15 text-slate-200 hover:text-white hover:bg-white/10 font-bold font-mono text-xs uppercase tracking-wider py-3.5 rounded-md transition-colors cursor-pointer shadow-md"
          >
            <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
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