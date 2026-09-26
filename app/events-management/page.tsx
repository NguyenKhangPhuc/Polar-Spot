import { getAllEvents } from "../actions/events";
import EventsManagementClient from "./EventsManagementClient";
import Link from "next/link";

export const metadata = {
  title: "Events Management | POLAR SPOT",
  description: "Admin portal for managing Polar Bear Pitching events, dates, locations, and status.",
};

export default async function EventsManagementPage() {
  const { data: initialEvents, error } = await getAllEvents();

  // Handle server fetch error directly in page.tsx
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono py-24 px-6 md:px-16 flex flex-col items-center justify-center select-none">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight">
              Failed to Load Events
            </h2>
            <p className="text-xs text-[#b9cbc2] leading-relaxed">
              {error || "An error occurred while connecting to the database server."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <Link
              href="/events-management"
              className="px-5 py-2.5 rounded-sm text-xs font-mono font-bold text-[#00382b] bg-[#00ffec] hover:brightness-110 uppercase tracking-wider transition-all"
            >
              Retry Loading
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <EventsManagementClient initialEvents={initialEvents || []} />
      </div>
    </div>
  );
}
