/**
 * Polar-Spot Design Tokens
 * Blue-White Ice theme elements & hovers while preserving dark ocean background.
 */

export const colors = {
  // Backgrounds (Preserved dark ocean background)
  bgDeep: "#050b14",
  bgDark: "#0b172a",
  surfaceGlass: "rgba(11, 23, 42, 0.75)",
  surfaceGlassHover: "rgba(20, 38, 66, 0.85)",
  
  // Blue & White Elements & Borders
  borderIce: "rgba(255, 255, 255, 0.15)",
  borderIceHover: "rgba(255, 255, 255, 0.45)",
  
  // Blue-White Elements & Accent Colors
  white: "#ffffff",
  iceBlueLight: "#f0f9ff",
  iceBlueMedium: "#bae6fd",
  skyBlue: "#38bdf8",
  
  // Text Colors
  textBright: "#ffffff",
  textIce: "#e0f2fe",
  textMuted: "#cbd5e1",
  textSubtle: "#94a3b8",
} as const;

export const tw = {
  bg: {
    main: "bg-[#050b14]",
    card: "bg-[#0b172a]/80 backdrop-blur-md",
    cardHover: "hover:bg-[#142847] hover:border-white/40 transition-all duration-300",
    buttonPrimary: "bg-white text-slate-950 font-bold hover:bg-sky-100 hover:text-slate-900 transition-colors shadow-lg shadow-white/10",
    buttonSecondary: "bg-slate-800 text-white border border-white/20 hover:bg-slate-700 hover:border-white/40",
  },
  border: {
    ice: "border border-white/15 hover:border-white/40 transition-colors",
  },
  text: {
    heading: "text-white font-extrabold",
    brand: "text-white font-bold",
    primary: "text-slate-100",
    muted: "text-slate-300",
    accent: "text-sky-200",
  },
  radius: {
    card: "rounded-2xl",
    button: "rounded-xl",
    pill: "rounded-full",
    avatar: "rounded-2xl",
  },
} as const;
