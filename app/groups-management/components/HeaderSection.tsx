"use client";

import React from "react";
import BackButton from "@/app/components/BackButton";

interface HeaderSectionProps {
  onOpenCreateModal: () => void;
}

export function HeaderSection({ onOpenCreateModal }: HeaderSectionProps) {
  return (
    <div className="flex flex-col space-y-4 border-b border-white/12 pb-6">
      <BackButton />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-xs font-bold text-black bg-[#3be1fe] hover:bg-[#6ee7fc] transition-colors shadow-lg uppercase tracking-wider shrink-0 cursor-pointer font-mono"
        >
          <span>+ CREATE NEW GROUP</span>
        </button>
      </div>
    </div>
  );
}

export default HeaderSection;
