"use client";

/**
 * PURPOSE:
 * Orchestrator client component for single event detail view at app/events/[id]/SingleEventClient.tsx.
 * Renders a full-width hero poster banner with event title overlay, followed by a 2-column grid layout
 * containing event logistics metadata on the left column and rich specification content (Plate.js) on the right column.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/events/[id]/page.tsx' Server Component.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record payload loaded from database.
 */

import React from "react";
import Image from "next/image";
import { Event } from "@/app/types/event";
import { EVENT_STATUS } from "@/app/types/enum";
import { createClient } from "@/app/utils/supabase/client";
import { handleGetUrl } from "@/app/helpers/file_url";
import BackButton from "@/app/components/BackButton";
import RichTextEditor from "@/app/components/RichTextEditor";

interface SingleEventClientProps {
  event: Event;
}

export default function SingleEventClient({ event }: SingleEventClientProps) {
  const supabase = createClient();

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves public image URL for event posters. Returns direct URL if already formatted,
   * otherwise constructs Supabase public storage endpoint URL.
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
  const isOngoing = event.status === EVENT_STATUS.ONGOING;
  const eventTitle =
    (event as any).title ||
    event.short_description ||
    "POLAR BEAR PITCHING EVENT";

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100 font-sans relative">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <BackButton />
      </div>

      {/* Hero Banner (w-full) - Standalone First Component with Overlaid Title */}
      <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#0a1526] flex items-center justify-center group">
        {posterUrl ? (
          <>
            {/* Ambient Blurred Backdrop to fill empty frame space */}
            <Image
              src={posterUrl}
              alt=""
              fill
              unoptimized
              aria-hidden="true"
              className="object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
            />
            {/* Main Poster Image Maintaining Exact Original Aspect Ratio inside Frame */}
            <Image
              src={posterUrl}
              alt={eventTitle}
              fill
              unoptimized
              priority
              className="object-contain p-2 relative z-10"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-950 via-[#0a1526] to-sky-950 flex flex-col items-center justify-center p-6 text-center">
            <svg className="w-16 h-16 text-cyan-400/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              OFFICIAL POLAR BEAR PITCHING STAGE
            </span>
          </div>
        )}

        {/* Dark Gradient Overlay for High Title Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1526] via-[#0a1526]/60 to-transparent z-10" />

        {/* Title & Badges Overlaid Directly On Top of Poster Image */}
        <div className="absolute bottom-6 left-6 right-6 z-20 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border backdrop-blur-md ${
                isOngoing
                  ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-900/90 text-slate-300 border-white/20"
              }`}
            >
              {event.status || "STATUS_UNSET"}
            </span>

            {event.member_per_groups && (
              <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                MAX {event.member_per_groups} MEMBERS / GROUP
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {eventTitle}
          </h1>
        </div>
      </div>

      {/* Main 2-Column Layout Below Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Event Metadata Panel (Narrower, lg:col-span-4) */}
        <aside className="lg:col-span-4 bg-[#13243b] border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6 sticky top-6">
          <div className="border-b border-white/12 pb-3">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>LOGISTICS &amp; INFO</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs font-medium text-slate-200">
            {/* Status */}
            <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                CURRENT STATUS
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOngoing ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-500"
                  }`}
                />
                <span className="text-sm font-extrabold uppercase text-white">
                  {event.status || "UNSET"}
                </span>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                GROUP CAPACITY LIMIT
              </span>
              <span className="text-sm font-bold text-cyan-300">
                {event.member_per_groups || 5} Members per Group
              </span>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  LOCATION / STAGE NODE
                </span>
                <span className="text-sm text-white font-medium">
                  {event.location}
                </span>
              </div>
            )}

            {/* Organized Date */}
            {event.organized_date && (
              <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ORGANIZED DATE &amp; TIME
                </span>
                <span className="text-sm text-white font-medium">
                  {new Date(event.organized_date).toLocaleString()}
                </span>
              </div>
            )}

            {/* Start and End Date */}
            {(event.start_date || event.end_date) && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  EVENT DURATION RANGE
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  {event.start_date ? new Date(event.start_date).toLocaleDateString() : "N/A"}{" "}
                  - {event.end_date ? new Date(event.end_date).toLocaleDateString() : "N/A"}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Right Column: Short Description & Plate.js Rich Content (lg:col-span-8) */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-[#13243b] border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-8">
            
            {/* Short Description Section */}
            {event.short_description && (
              <div className="space-y-2 border-b border-white/12 pb-6">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  EVENT OVERVIEW SUMMARY
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {event.short_description}
                </p>
              </div>
            )}

            {/* Rich Text Specification Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                FULL EVENT SPECIFICATION &amp; GUIDELINES
              </h3>
              
              <RichTextEditor
                value={typeof event.content === "string" ? event.content : JSON.stringify(event.content || "")}
                readOnly={true}
                className="min-h-[300px]"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
