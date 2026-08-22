import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] py-20 lg:py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Half: Thesis, Slogan & Action Button */}
        <div className="flex flex-col items-start text-left gap-8">
          {/* Real Telemetry Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-wider text-slate-300 bg-[#121212] border border-white/15 px-3.5 py-1.5 rounded-md">
            <span>Oulu, Finland</span>
            <span className="text-white/30">&bull;</span>
            <span className="text-[#3be1fe] font-semibold">Water: -1&deg;C</span>
            <span className="text-white/30">&bull;</span>
            <span>Baltic Sea Ice</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none font-sans">
              Polar-Spot
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3be1fe] leading-snug">
              &ldquo;Where Cool Ideas Freeze-Break Limits in the Freezing Arctic Ice!&rdquo;
            </p>
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            Welcome to the official event spot for Polar Bear Pitching — the world&apos;s most extreme startup pitching competition held in an ice-hole in Oulu, Finland. Test your limits, connect with global investors, and make an unforgettable splash!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-md font-bold text-black bg-[#3be1fe] hover:bg-[#6ee7fc] transition-colors shadow-lg shadow-[#3be1fe]/20 text-base"
            >
              <span>Explore Events</span>
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Half: Clean 1-Layer Image Container */}
        <div className="relative w-full max-w-xl aspect-[4/3] min-h-[320px] rounded-md overflow-hidden bg-[#121212] border border-white/15 flex items-center justify-center p-6 shadow-xl">
          <Image
            src="/polarbear-logo.png"
            alt="Polar Bear Pitching"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-contain p-4 hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </div>
    </section>
  );
}
