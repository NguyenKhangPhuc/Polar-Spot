import React from "react";
import Link from "next/link";
import { getEventById } from "@/app/actions/events";
import { getEventCriteriaByEventId } from "@/app/actions/event_grading_criteria";
import EditEventClient from "./EditEventClient";

/**
 * PURPOSE:
 * Server Component for the Event Configuration page at route app/events/[id]/edit/page.tsx.
 * Fetches target event details and associated grading criteria concurrently via Promise.all.
 *
 * CONTEXT/PARENT FILE:
 * Next.js App Router dynamic page route ('app/events/[id]/edit/page.tsx').
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Next.js route parameters object containing the target event ID.
 */

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;

  // Concurrent server-side fetching using Promise.all
  const [eventRes, criteriaRes] = await Promise.all([
    getEventById(id),
    getEventCriteriaByEventId(id),
  ]);

  // Render error state if event not found or fetch fails
  if (eventRes.error || !eventRes.data) {
    return (
      <div className="w-full min-h-screen py-16 px-4 flex items-center justify-center select-none text-slate-100">
        <div className="max-w-md w-full bg-[#13243b] border border-red-500/40 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            EVENT RECORD NOT FOUND
          </h2>
          <p className="text-sm text-slate-300">
            {eventRes.error || "Unable to locate event details matching the requested identifier."}
          </p>
          <Link
            href="/events-management"
            className="inline-block px-5 py-2.5 rounded-xl bg-white hover:bg-sky-100 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            RETURN TO EVENTS MANAGEMENT
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditEventClient
      event={eventRes.data}
      criteria={criteriaRes.data || []}
    />
  );
}
