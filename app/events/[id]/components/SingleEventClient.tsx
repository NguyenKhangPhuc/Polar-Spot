"use client";

/**
 * PURPOSE:
 * Orchestrator client component for single event detail view at app/events/[id]/SingleEventClient.tsx.
 * Manages poster image public storage URL resolution and delegates rendering to modular subcomponents
 * (TopNavigationBar, HeroBanner, EventLogisticsCard, EventContentCard).
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/events/[id]/page.tsx' Server Component.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record payload loaded from database.
 */

import React from "react";
import { Event } from "@/app/types/event";
import { createClient } from "@/app/utils/supabase/client";
import { handleGetUrl } from "@/app/helpers/file_url";
import TopNavigationBar from "./TopNavigationBar";
import HeroBanner from "./HeroBanner";
import EventLogisticsCard from "./EventLogisticsCard";
import EventContentCard from "./EventContentCard";

interface SingleEventClientProps {
  event: Event;
}

export function SingleEventClient({ event }: SingleEventClientProps) {
  const supabase = createClient();

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves public image URL for event posters. Returns direct URL if already formatted,
   * otherwise constructs Supabase public storage endpoint URL using handleGetUrl helper.
   *
   * PARAMETERS:
   * - posterPath (string | null | undefined): Raw image path stored in database.
   *
   * RETURNS:
   * - string | null: Fully qualified image URL string or null.
   */
  const getPosterUrl = (posterPath: string | null | undefined): string | null => {
    if (!posterPath) return null;
    if (
      posterPath.startsWith("http://") ||
      posterPath.startsWith("https://") ||
      posterPath.startsWith("/")
    ) {
      return posterPath;
    }
    return handleGetUrl(supabase, posterPath);
  };

  const posterUrl = getPosterUrl(event.poster_path);

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100 font-sans relative">
      {/* Top Navigation Bar */}
      <TopNavigationBar />

      {/* Hero Banner (w-full) - Standalone First Component with Overlaid Title */}
      <HeroBanner event={event} posterUrl={posterUrl} />

      {/* Main 2-Column Layout Below Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Event Metadata Panel (Narrower, lg:col-span-4) */}
        <EventLogisticsCard event={event} />

        {/* Right Column: Short Description & Plate.js Rich Content (lg:col-span-8) */}
        <EventContentCard event={event} />
      </div>
    </div>
  );
}

export default SingleEventClient;
