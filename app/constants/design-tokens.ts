/**
 * Polar-Spot Design Tokens
 * Grounded in the real Arctic subject of Polar Bear Pitching (Oulu, Finland).
 * Follows frontend-design and design-taste principles.
 */

export const colors = {
  // Subject Colors
  arcticAbyss: "#070d18",   // Deep Baltic Sea Arctic Night background
  glacialSlate: "#13243b",  // Elevated surface frost glass
  frostWhite: "#f8fafc",    // Primary high-contrast text
  auroraCyan: "#38bdf8",    // Accent for key interactive data
  iceRim: "rgba(255, 255, 255, 0.18)", // Structural ice borders
} as const;

export const tw = {
  bg: {
    main: "bg-[#070d18]",
    nav: "bg-[#13243b]/90 backdrop-blur-xl border-r border-white/18",
    card: "bg-[#13243b]/85 backdrop-blur-md border border-white/18 shadow-xl shadow-black/40",
    cardHover: "hover:bg-[#1a3150] hover:border-white/45 transition-all duration-300",
    imageHolder: "bg-[#0a1526] border border-white/20",
    buttonPrimary: "bg-white text-slate-950 font-bold hover:bg-sky-100 hover:text-slate-900 transition-colors shadow-lg shadow-white/10",
  },
  border: {
    ice: "border border-white/18 hover:border-white/45 transition-colors",
  },
  text: {
    heading: "text-white font-black tracking-tight",
    brand: "text-white font-bold",
    primary: "text-slate-100",
    muted: "text-slate-300",
    accent: "text-sky-300",
  },
  radius: {
    card: "rounded-2xl",
    button: "rounded-xl",
    pill: "rounded-full",
    avatar: "rounded-2xl",
  },
} as const;
