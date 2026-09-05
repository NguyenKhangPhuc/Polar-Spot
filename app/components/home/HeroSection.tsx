import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 md:px-16 py-20 bg-[linear-gradient(to_right,rgba(0,255,236,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,236,0.05)_1px,transparent_1px)] bg-[size:40px_40px]">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#151312]/50 via-[#151312] to-[#151312] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12">
        {/* Left Half: Thesis, Slogan & Action Button */}
        <div className="flex flex-col items-start text-left gap-8">
          {/* Real Telemetry Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#00ffec]/10 border border-[#00ffec]/20 rounded-sm font-mono text-[11px] uppercase tracking-[0.2em] text-[#00ffec]">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#00ffec] rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-[#00ffec]/40 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-[#00ffec]/20 rounded-full"></span>
            </div>
            <span>Oulu, Finland &bull; Water: -1&deg;C &bull; Baltic Sea Ice</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#e8e1df] leading-none font-montserrat">
              Polar-Spot
            </h1>
            <div className="h-[2px] w-32 bg-[linear-gradient(90deg,#00ffec_0%,transparent_100%)] my-4"></div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#00ffec] leading-snug">
              &ldquo;Where Cool Ideas Freeze-Break Limits in the Freezing Arctic Ice!&rdquo;
            </p>
          </div>

          <p className="text-base sm:text-lg text-[#b9cbc2] max-w-xl leading-relaxed opacity-80 font-medium">
            Welcome to the official event spot for Polar Bear Pitching — the world&apos;s most extreme startup pitching competition held in an ice-hole in Oulu, Finland. Test your limits, connect with global investors, and make an unforgettable splash!
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/events"
              className="w-full sm:w-auto bg-[#00ffec] text-[#00382b] font-bold text-sm px-10 py-4 rounded-sm flex items-center justify-center gap-3 group transition-all hover:translate-y-[-2px] uppercase tracking-widest duration-300 shadow-md shadow-[#00ffec]/20"
            >
              <span>Explore Events</span>
              <svg className="w-4 h-4 text-[#00382b] group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Half: Image Holder */}
        <div className="relative w-full max-w-xl aspect-[4/3] min-h-[320px] rounded-sm overflow-hidden bg-[#1d1b1a] border border-[#3a4a44]/50 flex items-center justify-center p-6 shadow-2xl group mx-auto lg:ml-auto">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,236,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,236,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          <Image
            src="/polarbear-logo.png"
            alt="Polar Bear Pitching"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 relative z-10"
            priority
          />
          <div className="absolute inset-0 border-2 border-[#00ffec]/0 group-hover:border-[#00ffec]/40 transition-all duration-500 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
