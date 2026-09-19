export default function LoadingComponent() {
  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen flex justify-center items-center screen-bg backdrop-blur-md">
      <div className="flex flex-col items-center justify-center gap-6 select-none font-mono">
        {/* Concentric Cyber Rings & Pulsing Core */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer subtle static ring */}
          <div className="absolute inset-0 rounded-full border border-white/5" />

          {/* Outer pulsing ping wave */}
          <div className="absolute inset-0 rounded-full border border-[#00ffec]/20 animate-ping" />

          {/* Rotating outer dash ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00ffec] border-r-[#00ffec]/30 animate-spin shadow-[0_0_24px_rgba(0,255,236,0.25)]" />

          {/* Counter-rotating inner ring */}
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-[#00ffec]/70 border-l-[#00ffec]/20 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />

          {/* Center glowing obsidian core */}
          <div className="relative w-4 h-4 rounded-sm bg-[#00ffec] shadow-[0_0_12px_#00ffec] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-sm bg-[#151312]" />
          </div>
        </div>

        {/* Brand / Status Tag */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] animate-pulse" />
            <span className="text-[10px] font-bold font-mono tracking-[0.25em] text-[#e8e1df] uppercase">
              POLAR SPOT
            </span>
          </div>
          <span className="text-[8px] font-mono tracking-widest text-[#83958d] uppercase">
            INITIALIZING STREAM...
          </span>
        </div>
      </div>
    </div>
  );
}
