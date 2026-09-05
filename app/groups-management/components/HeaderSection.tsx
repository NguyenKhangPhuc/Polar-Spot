"use client";

import React from "react";
import BackButton from "@/app/components/BackButton";

interface HeaderSectionProps {
  onOpenCreateModal: () => void;
}

export function HeaderSection({ onOpenCreateModal }: HeaderSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <BackButton href="/" label="BACK TO HOME" className="mb-0" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
        <div className="flex gap-4 items-stretch">
          <div className="w-[3px] bg-[#00ffec]" />
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              GROUPS MANAGEMENT
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-xs font-bold text-[#00382b] bg-[#00ffec] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,236,0.15)] uppercase tracking-wider font-mono cursor-pointer self-start md:self-auto"
        >
          <span>+ CREATE NEW GROUP</span>
        </button>
      </div>
    </div>
  );
}

export default HeaderSection;
