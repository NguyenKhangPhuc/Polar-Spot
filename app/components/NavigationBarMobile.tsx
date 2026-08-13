"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signout } from "@/app/actions/authentication";
import { useNotification } from "@/app/context/NotificationContext";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Events Management", href: "/events-management" },
  { name: "Groups Management", href: "/groups-management" },
];

interface NavigationBarMobileProps {
  user?: User | null;
}

export default function NavigationBarMobile({ user }: NavigationBarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 frost-nav border-b border-white/20 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-[#0f2038] p-0.5 border border-white/30 flex items-center justify-center">
            <Image
              src="/polarbear-logo.png"
              alt="Polar Bear Pitching Logo"
              width={26}
              height={26}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold text-white">
            Polar-Spot
          </span>
        </Link>

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Expandable Menu */}
      {isOpen && (
        <nav className="mt-3 pt-3 border-t border-white/15 flex flex-col gap-1 pb-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/20 text-white border border-white/40"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Auth Action Section */}
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center gap-2">
            {user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                type="button"
                className="w-full text-center py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 hover:text-white transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
                  className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md ${
                    pathname === "/sign-up"
                      ? "bg-cyan-300 text-slate-950 font-extrabold"
                      : "bg-white hover:bg-sky-100 text-slate-950"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
