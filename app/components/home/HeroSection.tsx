import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] py-20 lg:py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Half: Thesis, Slogan & Action Button */}
        <div className="flex flex-col items-start text-left gap-8">
          {/* Real Telemetry Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono tracking-wider text-slate-300 bg-[#0a1526] border border-white/20 px-3.5 py-1.5 rounded-md">
            <span>Oulu, Finland</span>
            <span className="text-white/30">&bull;</span>
            <span className="text-sky-300 font-semibold">Water: -1&deg;C</span>
            <span className="text-white/30">&bull;</span>
            <span>Baltic Sea Ice</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
              Polar-Spot
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-sky-200 leading-snug">
              &ldquo;Where Cool Ideas Freeze-Break Limits in the Freezing Arctic Ice!&rdquo;
            </p>
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            Welcome to the official event spot for Polar Bear Pitching — the world&apos;s most extreme startup pitching competition held in an ice-hole in Oulu, Finland. Test your limits, connect with global investors, and make an unforgettable splash!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-slate-950 bg-white hover:bg-sky-100 hover:text-slate-900 transition-colors shadow-lg shadow-white/10 text-base"
            >
              <span>Explore Events</span>
              <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Half: Polar Bear Pitching Image Frame */}
        <div className="relative w-full flex justify-center items-center">
          <div className="relative w-full max-w-xl rounded-2xl frost-card p-5 border border-white/25 hover:border-white/50 transition-colors shadow-2xl shadow-black/50 overflow-hidden">
            <div className="relative w-full aspect-[4/3] min-h-[320px] sm:min-h-[380px] rounded-xl overflow-hidden bg-[#0a1526] border border-white/20 flex items-center justify-center p-4">
              <Image
                src="/polarbear-logo.png"
                alt="Polar Bear Pitching"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
