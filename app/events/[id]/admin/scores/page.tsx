import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import { getAllUsersGroupGradings } from "@/app/actions/user_group_grading";
import AdminResultClient from "./AdminResultClient";
import BackButton from "@/app/components/BackButton";

/**
 * PURPOSE:
 * Server Component for administrative evaluation breakdown and matrix audit page
 * at 'app/events/[id]/admin/scores/page.tsx'.
 * Concurrently fetches target event details and detailed all-users group evaluations.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/[id]/admin/scores/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Route parameter object containing event UUID.
 */

interface AdminScoresPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminScoresPage({ params }: AdminScoresPageProps) {
  const { id } = await params;

  const [eventRes, allUsersGradingsRes] = await Promise.all([
    getSingleEventById(id),
    getAllUsersGroupGradings(id),
  ]);

  const event = eventRes.data || null;
  const allUsersGradings = allUsersGradingsRes.data || [];

  if (!event || eventRes.error) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono py-24 px-6 md:px-16 flex flex-col items-center justify-center select-none">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-mono font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight">
              Event Not Found
            </h2>
            <p className="text-xs text-[#b9cbc2] leading-relaxed font-mono">
              {eventRes.error || "The event record you requested could not be located in the database."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton label="BACK TO EVENTS" href="/events" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24 select-none">
      <div className="max-w-7xl mx-auto flex flex-col">
        <AdminResultClient
          event={event}
          allUsersGradings={allUsersGradings}
        />
      </div>
    </div>
  );
}
