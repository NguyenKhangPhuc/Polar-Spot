"use client";

import React from "react";
import { Event } from "@/app/types/event";
import { createClient } from "@/app/utils/supabase/client";
import { handleGetUrl } from "@/app/helpers/file_url";
import TopNavigationBar from "./components/TopNavigationBar";
import HeroBanner from "./components/HeroBanner";
import EventLogisticsCard from "./components/EventLogisticsCard";
import EventContentCard from "./components/EventContentCard";

interface SingleEventClientProps {
  event: Event;
}

export function SingleEventClient({ event }: SingleEventClientProps) {
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
    <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative max-w-7xl mx-auto">
      {/* Top Navigation Bar */}
      <TopNavigationBar eventId={event.id} />

      {/* Hero Banner (w-full) */}
      <HeroBanner event={event} posterUrl={posterUrl} />

      {/* Main 2-Column Layout Below Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Main Event Specification & Rich Content (Wider, lg:col-span-8) */}
        <EventContentCard event={event} />

        {/* Right Column: Event Logistics & Metadata Panel (Narrower, lg:col-span-4) */}
        <EventLogisticsCard event={event} />
      </div>
    </div>
  );
}

export default SingleEventClient;
