import type { Metadata } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Notification from "./components/Notification";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoaderProvider } from "./context/LoaderContext";
import { NotificationProvider } from "./context/NotificationContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "POLAR SPOT | Polar Bear Pitching Events Management",
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
      className={`${roboto.variable} ${montserrat.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col polar-snow-bg text-[#e8e1df] selection:bg-[#00ffec]/30 selection:text-[#00ffec] text-base font-sans bg-[#151312]">
        <NotificationProvider>
          <LoaderProvider>
            <TooltipProvider>
              {/* Global Backdrop Loader & Top-Right Animated Notification */}
              <Loader />
              <Notification />

              {/* Global Left Navigation Bar */}
              <Navbar />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col lg:pl-64 pt-16 lg:pt-0 min-h-screen">
                <main className="flex-1 w-full relative">{children}</main>
                
                {/* Global Footer */}
                <Footer />
              </div>
            </TooltipProvider>
          </LoaderProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
