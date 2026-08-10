/**
 * Polar-Spot Design Tokens
 * Refined Luminous Arctic Ice Blue palette for cards, navigation bar, and interactive surfaces.
 */

export const colors = {
  // Backgrounds
  bgDeep: "#050b14",
  bgDark: "#0c182b",
  surfaceFrost: "rgba(22, 43, 72, 0.8)",
  surfaceFrostHover: "rgba(31, 62, 104, 0.9)",
  navFrost: "rgba(19, 35, 58, 0.85)",
  
  // Blue-White Elements & Borders
  borderIce: "rgba(255, 255, 255, 0.2)",
  borderIceHover: "rgba(255, 255, 255, 0.5)",
  
  // Text Colors
  textBright: "#ffffff",
  textIce: "#e0f2fe",
  textMuted: "#cbd5e1",
  textSubtle: "#94a3b8",
} as const;

export const tw = {
  bg: {
    main: "bg-[#050b14]",
    nav: "bg-[#13233a]/85 backdrop-blur-xl border-r border-white/20",
    card: "bg-[#162b48]/80 backdrop-blur-lg border border-white/20 shadow-lg shadow-black/40",
    cardHover: "hover:bg-[#1f3e68]/90 hover:border-white/50 transition-all duration-300",
    imageHolder: "bg-[#0f2038] border border-white/25",
    buttonPrimary: "bg-white text-slate-950 font-bold hover:bg-sky-100 hover:text-slate-900 transition-colors shadow-lg shadow-white/10",
  },
  border: {
    ice: "border border-white/20 hover:border-white/50 transition-colors",
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
