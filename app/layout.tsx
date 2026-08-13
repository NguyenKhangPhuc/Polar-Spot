import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Polar-Spot | Polar Bear Pitching Events Management",
  description: "Official events management platform for Polar Bear Pitching in Oulu, Finland.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col polar-snow-bg text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 text-base font-sans">
        <TooltipProvider>
          {/* Global Left Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:pl-64 pt-16 lg:pt-0 min-h-screen">
            <main className="flex-1 w-full relative z-10">{children}</main>
            
            {/* Global Footer */}
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
