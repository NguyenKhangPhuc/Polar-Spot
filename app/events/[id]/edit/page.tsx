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
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono py-24 px-6 md:px-16 flex flex-col items-center justify-center select-none">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-mono font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight uppercase">
              Event Record Not Found
            </h2>
            <p className="text-xs text-[#b9cbc2] leading-relaxed font-mono">
              {eventRes.error || "Unable to locate event details matching the requested identifier."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <Link
              href="/events-management"
              className="inline-block px-5 py-2.5 rounded-sm bg-[#151312] hover:bg-[#252220] border border-white/10 text-xs font-bold font-mono text-[#e8e1df] uppercase tracking-wider transition-colors cursor-pointer"
            >
              RETURN TO EVENTS MANAGEMENT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24 select-none">
      <div className="max-w-7xl mx-auto flex flex-col">
        <EditEventClient
          event={eventRes.data}
          criteria={criteriaRes.data || []}
        />
      </div>
    </div>
  );
}
