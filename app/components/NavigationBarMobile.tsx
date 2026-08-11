"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

export default function NavigationBarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
        </nav>
      )}
    </header>
  );
}
