"use client";

import React from "react";
import { Event } from "@/app/types/event";
import { createClient } from "@/app/utils/supabase/client";
import { handleGetUrl } from "@/app/helpers/file_url";
import BackButton from "@/app/components/BackButton";
import EventHero from "./components/EventHero";
import EventOverview from "./components/EventOverview";
import EventLocation from "./components/EventLocation";
import EventSidebar from "./components/EventSidebar";

interface SingleEventClientProps {
  event: Event;
  isAdmin?: boolean;
}

/**
 * PURPOSE:
 * Primary client-side orchestrator for the Single Event Detail page.
 * Implements ITEE SPOT layout: Back navigation, full-width EventHero banner,
 * and 12-column two-column body (Overview + Location on left, Specification Sidebar on right).
 */
export function SingleEventClient({ event, isAdmin }: SingleEventClientProps) {
  const supabase = createClient();

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
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat overflow-x-hidden py-24 px-6 md:px-16 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top Back Navigation */}
        <BackButton label="BACK TO EVENTS" href="/events" />

        {/* Full-width Event Hero Banner */}
        <EventHero event={event} posterUrl={posterUrl} />

        {/* Main 2-Column Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Overview & Location */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <EventOverview
              content={event.content}
              eventId={event.id}
              isAdmin={isAdmin}
            />
            <EventLocation location={event.location} />
          </div>

          {/* Right Column (5 cols): Technical Specification Sidebar */}
          <EventSidebar event={event} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}

export default SingleEventClient;
