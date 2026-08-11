import { getAllEvents } from "../actions/events";
import EventsManagementClient from "./EventsManagementClient";
import Link from "next/link";

export const metadata = {
  title: "Events Management | Polar-Spot",
  description: "Admin portal for managing Polar Bear Pitching events, dates, locations, and status.",
};

export default async function EventsManagementPage() {
  const { data: initialEvents, error } = await getAllEvents();

  // Handle server fetch error directly in page.tsx
  if (error) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-6">
        <div className="frost-card rounded-2xl p-8 max-w-md w-full text-center space-y-5 border border-red-500/30 bg-[#13243b]/90 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Failed to Load Events</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {error || "An error occurred while connecting to the database server."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/events-management"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-sky-100 transition-colors"
            >
              Retry Loading
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EventsManagementClient
      initialEvents={initialEvents || []}
    />
  );
}
