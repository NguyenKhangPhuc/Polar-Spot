import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-cyan-500/20 bg-[#050b14]/90 backdrop-blur-md text-slate-400 py-8 px-6 lg:pl-72 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐻‍❄️</span>
            <span className="text-base font-bold bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              Polar-Spot
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Official Event Platform for Polar Bear Pitching • Oulu, Finland
          </p>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex items-center gap-6 text-xs text-slate-300 font-medium">
          <Link
            href="/terms-and-conditions"
            className="hover:text-cyan-300 hover:underline transition-colors"
          >
            Terms &amp; Conditions
          </Link>
          <span className="text-cyan-500/30">•</span>
          <Link
            href="/privacy-policy"
            className="hover:text-cyan-300 hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Polar-Spot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
