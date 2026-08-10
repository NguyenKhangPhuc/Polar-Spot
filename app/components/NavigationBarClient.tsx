"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
];

export default function NavigationBarClient() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 bottom-0 w-64 frost-card border-r border-white/15 z-30 p-6">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3 pb-8 border-b border-white/15">
        <div className="relative w-10 h-10 rounded-xl bg-slate-900 p-1 border border-white/30 flex items-center justify-center">
          <Image
            src="/polarbear-logo.png"
            alt="Polar Bear Pitching Logo"
            width={32}
            height={32}
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
                  ? "bg-white/15 text-white border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  : "text-slate-300 hover:text-white hover:bg-white/10 hover:border hover:border-white/20"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Arctic Pitching Info Card */}
      <div className="mt-auto p-4 rounded-xl bg-slate-900/60 border border-white/15">
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
