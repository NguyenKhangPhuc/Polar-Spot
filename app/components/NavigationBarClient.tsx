"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signout } from "@/app/actions/authentication";
import { useNotification } from "@/app/context/NotificationContext";

interface NavItem {
  name: string;
  href: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "About",
    href: "/about",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Events",
    href: "/events",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Events Management",
    href: "/events-management",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Groups Management",
    href: "/groups-management",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

interface NavigationBarClientProps {
  user?: User | null;
}

export default function NavigationBarClient({ user }: NavigationBarClientProps) {
  const pathname = usePathname();
  const { showNotification } = useNotification();

  const handleLogout = async (): Promise<void> => {
    try {
      await signout();
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        showNotification(error.message);
      }
    }
  };

  return (
    <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 bottom-0 w-64 frost-nav border-r border-white/20 z-30 p-6">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3 pb-8 border-b border-white/15">
        <div className="relative w-10 h-10 rounded-xl bg-[#0f2038] p-1 border border-white/30 flex items-center justify-center">
          <Image
            src="/polarbear-logo.png"
            alt="Polar Bear Pitching Logo"
            width={32}
            height={32}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Polar-Spot
          </h1>
          <p className="text-xs text-sky-200 font-medium">Polar Bear Pitching</p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="mt-8 flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-white/20 text-white border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "text-slate-200 hover:text-white hover:bg-white/10 hover:border hover:border-white/25"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-300"}`} />
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Auth Navigation Action Section */}
      <div className="pt-4 border-t border-white/15 mb-4">
        {user ? (
          <button
            onClick={handleLogout}
            type="button"
            className="w-full text-center py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 hover:text-white transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${
                pathname === "/login"
                  ? "bg-white/20 text-white border-white/40"
                  : "bg-[#0f2038] text-slate-200 border-white/20 hover:bg-white/10 hover:text-white"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md ${
                pathname === "/sign-up"
                  ? "bg-cyan-300 text-slate-950 font-extrabold"
                  : "bg-white hover:bg-sky-100 text-slate-950"
              }`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Arctic Pitching Info Card */}
      <div className="p-4 rounded-xl bg-[#0f2038]/90 border border-white/20">
        <div className="text-xs text-white font-semibold mb-1">
          Oulu, Finland
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Home of the freezing ice-hole startup pitches!
        </p>
      </div>
    </aside>
  );
}
