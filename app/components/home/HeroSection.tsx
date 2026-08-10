import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Half: Brand Text, Slogan & Action Button */}
        <div className="flex flex-col items-start text-left gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-md shadow-cyan-950/50">
            <span className="animate-pulse">❄️</span> Arctic Pitching Revolution
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                Polar-Spot
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-cyan-200/90 leading-relaxed">
              &ldquo;Where Cool Ideas Freeze-Break Limits in the Freezing Arctic Ice!&rdquo;
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Welcome to the official event spot for Polar Bear Pitching — the world&apos;s most extreme startup pitching competition held in an ice-hole in Oulu, Finland. Test your limits, connect with global investors, and make an unforgettable splash!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Explore Events</span>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Half: Polar Bear Pitching Image Placeholder */}
        <div className="relative w-full flex justify-center items-center">
          <div className="relative w-full aspect-[4/3] max-w-lg rounded-2xl frost-card p-3 border border-cyan-400/30 shadow-[0_0_40px_rgba(2,132,199,0.2)] group overflow-hidden">
            {/* Placeholder Container */}
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 flex flex-col items-center justify-center p-6 text-center border border-cyan-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-60" />
              
              {/* Polar Bear Placeholder Graphics */}
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-4 text-4xl shadow-inner shadow-cyan-400/20 group-hover:scale-110 transition-transform duration-300">
                🐻‍❄️
              </div>
              <h3 className="text-lg font-bold text-cyan-200 mb-1">
                Polar Bear Pitching Image
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                [ Image Placeholder - Insert Polar Bear Pitching photo here ]
              </p>
              <div className="mt-3 px-3 py-1 rounded-md bg-cyan-900/50 border border-cyan-400/30 text-[10px] uppercase font-mono tracking-wider text-cyan-300">
                Hero Banner Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
