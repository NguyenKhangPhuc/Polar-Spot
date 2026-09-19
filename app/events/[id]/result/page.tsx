import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import { getUser } from "@/app/actions/authentication";
import { getGroupFinalScoresByEventId } from "@/app/actions/final_scores";
import EventResultClient from "./EventResultClient";

/**
 * PURPOSE:
 * Server Component for event evaluation results page at 'app/events/[id]/result/page.tsx'.
 * Concurrently fetches target event details, authenticated user session, and group final scores.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/[id]/result/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Route parameter object containing event UUID.
 */

interface EventResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventResultPage({ params }: EventResultPageProps) {
  const { id } = await params;

  const [eventRes, userRes, scoresRes] = await Promise.all([
    getSingleEventById(id),
    getUser(),
    getGroupFinalScoresByEventId(id),
  ]);

  const event = eventRes.data || null;
  const user = userRes.data?.user || null;
  const groupFinalScores = scoresRes.data || [];

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24 select-none">
      <div className="max-w-7xl mx-auto flex flex-col">
        <EventResultClient
          event={event}
          user={user}
          groupFinalScores={groupFinalScores}
        />
      </div>
    </div>
  );
}
