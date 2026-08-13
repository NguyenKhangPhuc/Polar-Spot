"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Event } from "@/app/types/event";
import { Criteria } from "@/app/types/event_criteria";
import { updateEventPoster } from "@/app/actions/events";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { createClient } from "@/app/utils/supabase/client";
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

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves the public URL for a given poster path stored in Supabase storage bucket 'attachments'.
   *
   * PARAMETERS:
   * - imagePath (string): Relative storage path of the image.
   *
   * RETURNS:
   * - string: Fully qualified public URL.
   */
  const handleGetInitialImage = (imagePath: string): string => {
    const { data } = supabase.storage.from("attachments").getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    event.poster_path ? handleGetInitialImage(event.poster_path) : null
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

  const eventTitle = event.short_description || event.location || event.id;

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100">
      {/* Back Button */}
      <BackButton />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Edit Event: {eventTitle}
          </h1>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Square Event Poster Upload Box */}
        <div className="lg:col-span-4 flex flex-col gap-4 select-none">
          <div className="flex gap-2 items-center text-xs font-bold text-sky-300 uppercase tracking-widest">
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            EVENT_POSTER_IMAGE
          </div>
          
          <div className="bg-[#13243b]/90 border border-white/18 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xl">
            {/* Square Crop Box Container */}
            <div className="relative w-full aspect-square border-2 border-dashed border-white/20 hover:border-cyan-400/60 transition-colors bg-[#0a1526]/80 flex items-center justify-center cursor-pointer rounded-xl overflow-hidden group">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Event Poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                  {/* Hover Overlay Text Info */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-500/40">
                      [+] CHANGE_POSTER
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
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-slate-900/90 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-950 transition-all flex items-center justify-center cursor-pointer z-10 shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="text-center p-6 flex flex-col items-center gap-3 text-slate-400">
                  <svg className="w-10 h-10 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    UPLOAD_POSTER_IMAGE
                  </span>
                  <span className="text-[10px] text-sky-200/60 font-medium">
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
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#0a1526] p-1.5 rounded-2xl border border-white/18 select-none w-full shadow-lg">
            {(["basic", "criteria"] as ConfigPage[]).map((tab) => {
              const isActive = currentPage === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCurrentPage(tab)}
                  className={`w-full text-center py-3 text-xs uppercase font-extrabold tracking-widest transition-all duration-300 rounded-xl relative select-none cursor-pointer ${
                    isActive ? "text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {/* Slide Animation Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="editTabActiveIndicator"
                      className="absolute inset-0 bg-cyan-400 rounded-xl z-0 shadow-[0_0_12px_#38bdf8]"
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
