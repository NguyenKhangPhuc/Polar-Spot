import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import { getAllUsersGroupGradings } from "@/app/actions/user_group_grading";
import AdminResultClient from "./AdminResultClient";

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
