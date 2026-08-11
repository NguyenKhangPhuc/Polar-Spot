"use client";

import React from "react";

/**
 * PURPOSE:
 * Header section component for the Groups Management portal. Displays the main title,
 * descriptive subtitle, and primary CTA button to trigger the Create Group modal.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/groups-management/GroupManagementClient.tsx to encapsulate portal header branding and trigger action.
 *
 * INPUTS / PARAMETERS:
 * - onOpenCreateModal (function, Required): Callback invoked when the user clicks '+ CREATE NEW GROUP'.
 */

interface HeaderSectionProps {
  onOpenCreateModal: () => void;
}

export function HeaderSection({ onOpenCreateModal }: HeaderSectionProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Displays the title, subtitle, and an interactive trigger button styled in the Arctic Cyber-Frost theme.
   * Clicking the button invokes the onOpenCreateModal callback passed from the parent orchestrator component.
   *
   * PARAMETERS:
   * - props (HeaderSectionProps): Object containing onOpenCreateModal callback.
   *
   * RETURNS:
   * - JSX.Element: Rendered header container with title and action button.
   */
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Groups Management
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium mt-2">
          ROSTER &amp; TEAMS CONTROL PANEL FOR POLAR BEAR PITCHING
        </p>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-sky-100 transition-colors shadow-lg shadow-white/10 uppercase tracking-wider shrink-0 cursor-pointer"
      >
        <span>+ CREATE NEW GROUP</span>
      </button>
    </div>
  );
}

export default HeaderSection;
