/**
 * Polar-Spot Design Tokens
 * Centralized color palette, borders, background styles, typography accents, and glassmorphism definitions.
 */

export const colors = {
  // Backgrounds
  bgDeep: "#050b14",
  bgDark: "#0b172a",
  surfaceGlass: "rgba(15, 30, 56, 0.65)",
  surfaceGlassHover: "rgba(23, 46, 82, 0.75)",
  
  // Borders & Glows
  borderIce: "rgba(148, 216, 255, 0.18)",
  borderIceHover: "rgba(56, 189, 248, 0.45)",
  glowCyan: "rgba(56, 189, 248, 0.25)",
  
  // Brand / Accents
  primary: "#0284c7",
  primaryHover: "#0369a1",
  cyanGlow: "#38bdf8",
  tealAurora: "#14b8a6",
  purpleAurora: "#818cf8",
  
  // Text Colors
  textBright: "#f0f9ff",
  textMuted: "#94a3b8",
  textSubtle: "#64748b",
} as const;

export const tw = {
  bg: {
    main: "bg-[#050b14]",
    card: "bg-[#0b172a]/70 backdrop-blur-md",
    cardHover: "hover:bg-[#13233f]/80 transition-all duration-300",
    buttonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40",
    buttonSecondary: "bg-slate-800/80 hover:bg-slate-700/80 text-cyan-200 border border-cyan-500/30",
    badge: "bg-cyan-950/60 border border-cyan-500/30 text-cyan-300",
  },
  border: {
    ice: "border border-cyan-500/20 hover:border-cyan-400/40 transition-colors",
    glow: "border border-cyan-400/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]",
  },
  text: {
    gradientHeading: "bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent",
    gradientBrand: "bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent",
    primary: "text-slate-100",
    muted: "text-slate-400",
    accent: "text-cyan-400",
  },
  radius: {
    card: "rounded-2xl",
    button: "rounded-xl",
    pill: "rounded-full",
    avatar: "rounded-2xl",
  },
} as const;
