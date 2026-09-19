"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Event } from "@/app/types/event";
import { Criteria } from "@/app/types/event_criteria";
import { updateEventPoster } from "@/app/actions/events";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { createClient } from "@/app/utils/supabase/client";
import { handleGetUrl } from "@/app/helpers/file_url";
import BackButton from "@/app/components/BackButton";
import BasicInfoSection from "./components/BasicInfoSection";
import CriteriaSection from "./components/CriteriaSection";

type ConfigPage = "basic" | "criteria";

/**
 * PURPOSE:
 * Client Component for the Edit Event Dashboard. Manages configuration page tabs (Basic Info, Criteria),
 * embeds a square event poster auto-upload module, and orchestrates editing panels with Framer Motion transitions.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in app/events/[id]/edit/page.tsx.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Preloaded event record.
 * - criteria (Criteria[], Required): Preloaded grading criteria list.
 */

interface EditEventClientProps {
  event: Event;
  criteria: Array<Criteria>;
}

export default function EditEventClient({ event, criteria }: EditEventClientProps) {
  const supabase = createClient();
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  const [currentPage, setCurrentPage] = useState<ConfigPage>("basic");

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    event.poster_path ? handleGetUrl(supabase, event.poster_path) : null
  );

  /**
   * BEHAVIORAL MECHANISM:
   * Handles selection of a new poster image file. Immediately triggers the updateEventPoster
   * server action to update storage and database records, showing status loaders.
   *
   * PARAMETERS:
   * - file (File): The selected image file.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleFileChange = async (file: File): Promise<void> => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setIsOpenLoader(true);
    try {
      const { error } = await updateEventPoster({
        eventId: event.id,
        posterFile: file,
        originalPath: event.poster_path || null,
      });
      if (error) {
        throw new Error(error);
      }
      showNotification("Update poster image successfully");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message);
      } else {
        showNotification("Failed to update poster image.");
      }
    } finally {
      setIsOpenLoader(false);
    }
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers event poster removal by calling updateEventPoster server action with null file payload,
   * cleaning up storage records and resetting local state indicators.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleRemoveAvatarFile = async (): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const { error } = await updateEventPoster({
        eventId: event.id,
        posterFile: null,
        originalPath: event.poster_path || null,
      });
      if (error) {
        throw new Error(error);
      }
      setPreviewUrl(null);
      showNotification("Remove poster image successfully");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message);
      } else {
        showNotification("Failed to remove poster image.");
      }
    } finally {
      setIsOpenLoader(false);
    }
  };

  const eventTitle =
    (event as any)?.title ||
    event.short_description ||
    event.location ||
    event.id;

  return (
    <div className="w-full flex flex-col gap-8 select-text font-mono">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-2">
        <BackButton
          href={`/events/${event.id}`}
          label="BACK TO EVENT DETAILS"
          className="mb-0"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
          <div className="flex gap-4 items-stretch">
            <div className="w-[3px] bg-[#00ffec]" />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
                Edit Event Specification
              </h1>
              <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text">
                <span>EVENT: {eventTitle.toUpperCase()}</span>
                <span>|</span>
                <span>EVENT ID: {event.id.slice(0, 8)}...</span>
                <span>|</span>
                <span>MODE: CONFIGURATION DASHBOARD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/events/${event.id}`}
              className="self-start md:self-auto px-4 py-2 rounded-sm bg-[#1d1b1a] hover:bg-[#252220] border border-white/10 text-xs font-bold font-mono text-[#e8e1df] uppercase tracking-wider transition-colors shadow-sm"
            >
              VIEW EVENT DETAILS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Square Event Poster Upload Box */}
        <div className="lg:col-span-4 flex flex-col gap-4 select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00ffec]" />
            <span>EVENT POSTER IMAGE</span>
          </div>

          <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-4 sm:p-5 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/50" />

            {/* Square Crop Box Container */}
            <div className="relative w-full aspect-square border-2 border-dashed border-white/10 hover:border-[#00ffec]/50 transition-colors bg-[#151312] flex items-center justify-center cursor-pointer rounded-sm overflow-hidden group">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt={event.short_description || "Event Poster"}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                  {/* Hover Overlay Text Info */}
                  <div className="absolute inset-0 bg-[#151312]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                    <span className="text-xs font-bold text-[#00ffec] uppercase tracking-widest bg-[#151312] px-3 py-1.5 rounded-sm border border-[#00ffec]/40 font-mono shadow-sm">
                      [+] CHANGE POSTER
                    </span>
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleRemoveAvatarFile();
                    }}
                    type="button"
                    title="Remove Poster Image"
                    className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-[#151312] border border-red-500/40 text-red-400 hover:text-white hover:bg-red-950/80 transition-all flex items-center justify-center cursor-pointer z-20 shadow-md"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="text-center p-6 flex flex-col items-center gap-3 text-[#83958d]">
                  <svg
                    className="w-10 h-10 text-[#00ffec]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e8e1df] font-mono">
                    UPLOAD EVENT POSTER
                  </span>
                  <span className="text-[10px] text-[#83958d] font-mono">
                    (RECOMMENDED SQUARE ASPECT 1:1)
                  </span>
                </div>
              )}

              {/* Upload Input Overlay */}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-0"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileChange(files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Navigation and Configuration Panels */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Tab Navigation Row */}
          <div className="flex items-center gap-2 bg-[#151312] p-1.5 rounded-sm border border-white/5 select-none w-full shadow-lg font-mono text-xs">
            {(["basic", "criteria"] as ConfigPage[]).map((tab) => {
              const isActive = currentPage === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCurrentPage(tab)}
                  className={`w-full text-center py-2.5 text-xs uppercase font-extrabold tracking-widest transition-all duration-300 rounded-sm relative select-none cursor-pointer font-mono ${
                    isActive
                      ? "text-[#00382b]"
                      : "text-[#83958d] hover:text-[#e8e1df] hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Slide Animation Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="editTabActiveIndicator"
                      className="absolute inset-0 bg-[#00ffec] rounded-sm z-0 shadow-[0_0_12px_rgba(0,255,236,0.25)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab === "basic" ? "Basic Info" : "Criteria"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Configuration Panel */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {currentPage === "basic" && (
                  <BasicInfoSection page={currentPage} event={event} />
                )}
                {currentPage === "criteria" && (
                  <CriteriaSection
                    receivedCriteria={criteria}
                    eventId={event.id}
                    page={currentPage}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
