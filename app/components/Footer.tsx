import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/15 bg-[#050b14]/90 backdrop-blur-md text-slate-400 py-8 px-6 lg:pl-72 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 rounded-md bg-slate-900 border border-white/30 flex items-center justify-center">
              <Image
                src="/polarbear-logo.png"
                alt="Polar Bear Pitching Logo"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
              />
            </div>
            <span className="text-base font-bold text-white">
              Polar-Spot
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Official Event Platform for Polar Bear Pitching • Oulu, Finland
          </p>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex items-center gap-6 text-xs text-slate-300 font-medium">
          <Link
            href="/terms-and-conditions"
            className="hover:text-white hover:underline transition-colors"
          >
            Terms &amp; Conditions
          </Link>
          <span className="text-white/30">&bull;</span>
          <Link
            href="/privacy-policy"
            className="hover:text-white hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Polar-Spot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
