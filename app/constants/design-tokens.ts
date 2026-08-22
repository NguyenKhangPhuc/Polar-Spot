/**
 * Polar-Spot Design Tokens
 * Grounded in Deep Black navbar (#000000), Charcoal Black page bg (#09090b),
 * Surface Black cards (#121212), and Cyber Cyan (#3be1fe) theme.
 */

export const colors = {
  // Theme Colors
  deepBlack: "#000000",       // Pure black navbar
  pageBlack: "#09090b",       // Dark charcoal page background
  surfaceBlack: "#121212",    // Elevated card surface
  themeCyan: "#3be1fe",       // Primary cyan theme accent
  frostWhite: "#f8fafc",      // High contrast text
  subtleBorder: "rgba(255, 255, 255, 0.12)",
} as const;

export const tw = {
  bg: {
    main: "bg-[#09090b]",
    nav: "bg-[#000000] border-r border-white/10",
    card: "bg-[#121212] border border-white/12 shadow-xl shadow-black",
    cardHover: "hover:bg-[#18181b] hover:border-[#3be1fe]/50 transition-all duration-300",
    imageHolder: "bg-[#050505] border border-white/15",
    buttonPrimary: "bg-[#3be1fe] text-black font-bold hover:bg-[#6ee7fc] transition-colors shadow-md shadow-[#3be1fe]/20",
  },
  border: {
    ice: "border border-white/12 hover:border-[#3be1fe]/50 transition-colors",
  },
  text: {
    heading: "text-white font-black tracking-tight",
    brand: "text-white font-bold",
    primary: "text-slate-100",
    muted: "text-slate-400",
    accent: "text-[#3be1fe]",
  },
  radius: {
    card: "rounded-md",
    button: "rounded-md",
    pill: "rounded-sm",
    avatar: "rounded-md",
  },
} as const;
