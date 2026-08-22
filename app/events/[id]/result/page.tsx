import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import { getUser } from "@/app/actions/authentication";
import { getGroupFinalScoresByEventId } from "@/app/actions/final_scores";
import EventResultClient from "./EventResultClient";

/**
 * PURPOSE:
 * Server Component for event evaluation results page at 'app/events/[id]/result/page.tsx'.
 * Concurrently fetches target event details, authenticated user session, and group final scores
 * from the 'group_final_scores' database view.
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
    <EventResultClient
      event={event}
      user={user}
      groupFinalScores={groupFinalScores}
    />
  );
}
