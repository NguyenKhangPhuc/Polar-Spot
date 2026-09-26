import Link from "next/link";
import Image from "next/image";
import { tw } from "../constants/design-tokens";

/**
 * PURPOSE:
 * Modular global application footer representing the Polar-Spot platform.
 * Formatted with a 4-column responsive grid, brand mission statement,
 * navigation paths, protocol/legal agreements, and copyright metadata.
 *
 * CONTEXT:
 * Mounted in `app/layout.tsx`.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${tw.bg.footer} w-full py-16 text-[#e8e1df] select-none`}>
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission Column (Spans 2 columns on tablet/desktop) */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="w-10 h-10 rounded-sm bg-[#151312] border border-white/10 p-2 flex items-center justify-center shadow-lg group-hover:border-[#00ffec]/50 transition-colors">
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
                <span className="font-extrabold text-base tracking-wider uppercase text-[#e8e1df] font-mono group-hover:text-[#00ffec] transition-colors">
                  POLAR SPOT
                </span>
                <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                  Event Platform • Oulu, Finland
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#b9cbc2] opacity-75 max-w-sm mb-6 leading-relaxed font-sans">
              Official event management and live evaluation platform for Polar Bear Pitching. Empowering arctic entrepreneurs and international investors in Oulu, Finland.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className={`${tw.text.footerHeading} mb-6 flex items-center gap-2`}>
              <span className="w-[3px] h-3 bg-[#00ffec]" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-4 text-sm font-sans">
              <li>
                <Link href="/about" className={tw.text.footerLink}>
                  Platform Overview
                </Link>
              </li>
              <li>
                <Link href="/events" className={tw.text.footerLink}>
                  Events Directory
                </Link>
              </li>
              <li>
                <Link href="/#groups" className={tw.text.footerLink}>
                  Startups &amp; Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocol / Legal Column */}
          <div>
            <h4 className={`${tw.text.footerHeading} mb-6 flex items-center gap-2`}>
              <span className="w-[3px] h-3 bg-[#00ffec]" />
              <span>Protocol</span>
            </h4>
            <ul className="space-y-4 text-sm font-sans">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className={tw.text.footerLink}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className={tw.text.footerLink}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata Row */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className={tw.text.footerCopy}>
            &copy; {currentYear} POLAR SPOT // Business Oulu Event System
          </p>
          <p className={tw.text.footerCopy}>
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
