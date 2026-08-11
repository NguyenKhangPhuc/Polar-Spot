"use client";

import React from "react";

/**
 * PURPOSE:
 * Header section component for the Events Management portal. Renders the main title,
 * descriptive tagline, and the primary action button to open the Create Event modal.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events-management/EventsManagementClient.tsx to isolate top-level portal branding and trigger actions.
 *
 * INPUTS / PARAMETERS:
 * - onOpenModal (function, Required): Callback function triggered when the user clicks '+ CREATE NEW EVENT'.
 */

interface HeaderSectionProps {
  onOpenModal: () => void;
}

export function HeaderSection({ onOpenModal }: HeaderSectionProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Displays the title, subtitle, and an interactive trigger button styled in the Arctic Cyber-Frost theme.
   * Clicking the button invokes the onOpenModal callback passed from the parent orchestrator component.
   *
   * PARAMETERS:
   * - props (HeaderSectionProps): Object containing onOpenModal callback.
   *
   * RETURNS:
   * - JSX.Element: Rendered header container with title and action button.
   */
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Events Management
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
          REGISTRY &amp; CONTROL PANEL FOR POLAR BEAR PITCHING EVENTS
        </p>
      </div>

      <button
        onClick={onOpenModal}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-sky-100 transition-colors shadow-lg shadow-white/10 uppercase tracking-wider shrink-0 cursor-pointer"
      >
        <span>+ CREATE NEW EVENT</span>
      </button>
    </div>
  );
}

export default HeaderSection;
