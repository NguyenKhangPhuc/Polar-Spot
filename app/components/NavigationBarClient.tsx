"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

interface NavigationBarClientProps {
  user?: User | null;
  isAdmin?: boolean;
}

export default function NavigationBarClient({ user, isAdmin = false }: NavigationBarClientProps) {
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
    <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 bottom-0 w-64 bg-[#151312]/95 backdrop-blur-xl border-r border-white/5 z-40 p-6 overflow-y-auto font-montserrat select-none">
      {/* Brand Logo & Name */}
      <div className="mb-8 flex flex-col justify-start pb-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-sm bg-[#1d1b1a] p-1 border border-[#3a4a44]/50 flex items-center justify-center shrink-0 group-hover:border-[#00ffec]/50 transition-colors shadow-sm">
            <Image
              src="/polarbear-logo.png"
              alt="Polar Bear Pitching Logo"
              width={28}
              height={28}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#e8e1df] font-montserrat leading-tight group-hover:text-[#00ffec] transition-colors">
              POLAR SPOT
            </span>
            <span className="text-[9px] font-mono text-[#00ffec] uppercase tracking-wider">
              Polar Bear Pitching
            </span>
          </div>
        </Link>
      </div>

      {/* Categorized Navigation Sections */}
      <nav className="flex flex-col gap-6 flex-1">
        {categories.map((category) => (
          <div key={`category-${category.category}`} className="flex flex-col gap-2">
            <div className="text-[10px] font-mono text-[#83958d]/50 uppercase tracking-widest px-4 select-none">
              {category.category}
            </div>
            <div className="flex flex-col gap-1">
              {category.items.map((item) => {
                const isActive = pathname === item.link;
                const Icon = item.icon;
                return (
                  <Link
                    key={`item-${item.title}`}
                    href={item.link}
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-sm transition-all font-semibold text-sm group ${
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

      {/* Auth Navigation Action Section */}
      <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
        {user ? (
          <button
            onClick={handleLogout}
            type="button"
            className="w-full bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-sm font-semibold text-xs hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer font-montserrat"
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
              className="w-full bg-[#00ffec] text-[#00382b] px-4 py-2.5 rounded-sm font-bold text-xs hover:brightness-110 transition-all uppercase tracking-widest flex items-center justify-center gap-2 text-center font-montserrat shadow-md shadow-[#00ffec]/15"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Sign In</span>
            </Link>
            <Link
              href="/sign-up"
              className="w-full bg-[#373433] text-[#e8e1df] border border-white/10 hover:bg-[#474443] hover:border-[#00ffec]/30 px-4 py-2.5 rounded-sm font-bold text-xs transition-all uppercase tracking-widest flex items-center justify-center gap-2 text-center font-montserrat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Sign Up</span>
            </Link>
          </div>
        )}

        {/* System Auth Status Indicator */}
        <div className="flex items-center gap-2.5 text-[10px] font-mono text-[#83958d] select-none pt-1">
          <div className={`w-2 h-2 rounded-full animate-pulse ${user ? "bg-[#00ffec]" : "bg-red-500"}`} />
          <span>{user ? (isAdmin ? "Auth: ADMIN" : "Auth: USER") : "Auth: Offline"}</span>
        </div>
      </div>
    </aside>
  );
}
