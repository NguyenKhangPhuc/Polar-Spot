"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { signout } from "@/app/actions/authentication";
import { useNotification } from "@/app/context/NotificationContext";

interface NavItem {
  title: string;
  link: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const baseCategory: NavCategory = {
  category: "Navigation",
  items: [
    {
      title: "Home",
      link: "/",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: "About",
      link: "/about",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Events",
      link: "/events",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ],
};

const adminCategory: NavCategory = {
  category: "Administration",
  items: [
    {
      title: "Events Management",
      link: "/events-management",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Groups Management",
      link: "/groups-management",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "User Management",
      link: "/users-management",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 100 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ],
};

interface NavigationBarMobileProps {
  user?: User | null;
  isAdmin?: boolean;
}

export default function NavigationBarMobile({ user, isAdmin = false }: NavigationBarMobileProps) {
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

  const categories = isAdmin ? [baseCategory, adminCategory] : [baseCategory];

  return (
    <>
      {/* Fixed top mobile bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 bg-[#151312]/95 backdrop-blur-xl border-b border-white/5 h-16 select-none font-montserrat">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-sm bg-[#1d1b1a] p-1 border border-[#3a4a44]/50 flex items-center justify-center shrink-0">
            <Image
              src="/polarbear-logo.png"
              alt="Polar Bear Pitching Logo"
              width={24}
              height={24}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
            />
          </div>
          <span className="text-base font-bold text-[#e8e1df] font-montserrat tracking-tight">
            POLAR SPOT
          </span>
        </Link>

        {/* Hamburger / Close Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="relative w-9 h-9 flex items-center justify-center rounded-sm hover:bg-[#00ffec]/5 transition-colors cursor-pointer select-none text-[#83958d] hover:text-[#00ffec]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Drawer Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Slide-in Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-0 z-50 h-full w-[250px] bg-[#151312]/95 backdrop-blur-xl border-r border-white/5 flex flex-col py-6 px-4 shadow-2xl lg:hidden overflow-y-auto font-montserrat"
          >
            {/* Brand Header */}
            <div className="mb-6 flex flex-col px-2 select-none">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold tracking-tight text-[#00ffec] font-montserrat"
              >
                POLAR SPOT
              </Link>
            </div>

            {/* Auth Status Badge */}
            <div className="flex items-center gap-2 px-2 mb-6 text-[9px] font-mono text-[#83958d] select-none">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user ? "bg-[#00ffec]" : "bg-red-500"}`} />
              <span>{user ? (isAdmin ? "Auth: ADMIN" : "Auth: USER") : "Auth: Offline"}</span>
            </div>

            {/* Categorized Navigation Lists */}
            <nav className="flex flex-col gap-5 flex-grow pr-1">
              {categories.map((category) => (
                <div key={`category-${category.category}`} className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-[#83958d]/50 uppercase tracking-widest px-3 select-none">
                    {category.category}
                  </span>
                  <div className="flex flex-col gap-1">
                    {category.items.map((item) => {
                      const isActive = pathname === item.link;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={`item-${item.title}`}
                          href={item.link}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all font-semibold text-xs group ${
                            isActive
                              ? "text-[#00ffec] bg-[#00ffec]/5 border-r-2 border-[#00ffec]"
                              : "text-[#b9cbc2] hover:text-[#00ffec] hover:bg-[#00ffec]/5"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? "text-[#00ffec]" : "text-[#83958d] group-hover:text-[#00ffec]"
                            }`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Bottom Auth Actions */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/5 mt-auto">
              {user ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all uppercase tracking-widest cursor-pointer w-full justify-center font-montserrat"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs font-bold text-[#00382b] bg-[#00ffec] hover:brightness-110 transition-all uppercase tracking-widest w-full justify-center font-montserrat shadow-md shadow-[#00ffec]/15"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs font-bold text-[#e8e1df] bg-[#373433] border border-white/10 hover:bg-[#474443] hover:border-[#00ffec]/30 transition-all uppercase tracking-widest w-full justify-center font-montserrat"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
