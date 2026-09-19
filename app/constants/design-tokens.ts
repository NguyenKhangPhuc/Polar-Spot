/**
 * Polar-Spot Design Tokens
 * Styled after ITEE SPOT design system:
 * - Warm dark background (#151312)
 * - Deep dark secondary (#100e0d)
 * - Elevated card surface (#1d1b1a)
 * - Neon Cyan / Teal accent (#00ffec)
 * - Cream / Soft off-white text (#e8e1df)
 * - Muted gray-green text (#b9cbc2)
 * - Subtle border accent (#3a4a44)
 */

export const colors = {
  // Theme Colors
  deepBlack: "#100e0d",       // Darkest section background
  pageBlack: "#151312",       // Warm dark page background
  surfaceBlack: "#1d1b1a",    // Elevated card surface
  themeEmerald: "#00ffec",    // Primary neon cyan theme accent
  textDarkAccent: "#00382b",  // Dark text on accent button
  frostWhite: "#e8e1df",      // High contrast cream text
  mutedText: "#b9cbc2",       // Muted gray-green text
  subtleBorder: "rgba(58, 74, 68, 0.5)",
} as const;

export const tw = {
  bg: {
    main: "bg-[#151312]",
    darkSection: "bg-[#100e0d]",
    nav: "bg-[#100e0d] border-r border-[#3a4a44]/50",
    card: "bg-[#1d1b1a] border border-[#3a4a44]/50 shadow-xl shadow-black/40",
    cardHover: "hover:bg-[#252220] hover:border-[#00ffec]/50 transition-all duration-300",
    imageHolder: "bg-[#141211] border border-[#3a4a44]/60",
    buttonPrimary: "bg-[#00ffec] text-[#00382b] font-bold hover:brightness-110 transition-all shadow-md shadow-[#00ffec]/20 uppercase tracking-widest",
    buttonSecondary: "border border-[#3a4a44] bg-[#373433]/50 text-[#e8e1df] font-bold hover:bg-white/10 transition-all uppercase tracking-widest",
    authCard: "bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 shadow-2xl flex flex-col gap-5 w-full",
    authInput: "bg-[#151312] border border-white/5 rounded-sm focus-within:border-[#00ffec]/50 text-[#e8e1df]",
  },
  border: {
    ice: "border border-[#3a4a44]/50 hover:border-[#00ffec]/50 transition-colors",
    whiteSubtle: "border-white/5",
  },
  text: {
    heading: "text-[#e8e1df] font-bold tracking-tight font-montserrat",
    brand: "text-[#e8e1df] font-bold font-montserrat",
    primary: "text-[#e8e1df]",
    muted: "text-[#b9cbc2]",
    accent: "text-[#00ffec]",
    authLabel: "text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold mb-1.5 flex items-center justify-between",
  },
  radius: {
    card: "rounded-sm",
    button: "rounded-sm",
    pill: "rounded-sm",
    avatar: "rounded-sm",
  },
} as const;
