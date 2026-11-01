import React from "react";

export default function EventGroupsLoading() {
  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat overflow-x-hidden py-24 px-6 md:px-16 select-none animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* 1. Header Skeleton */}
        <div className="space-y-4 border-b border-white/10 pb-6 w-full">
          <div className="w-48 h-8 rounded-sm bg-[#1d1b1a] border border-white/5" />
          <div className="space-y-2 pt-1">
            <div className="w-72 sm:w-96 h-9 rounded-sm bg-[#1d1b1a] border border-white/5" />
            <div className="w-48 sm:w-64 h-4 rounded-sm bg-[#1d1b1a]/60 border border-white/5" />
          </div>
        </div>

        {/* 2. Main 2-Column Responsive Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Left Column: Filter Sidebar Skeleton */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-6 shadow-xl w-full">
              {/* Filter Header Indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="w-28 h-4 rounded-sm bg-[#151312]" />
                <div className="w-12 h-4 rounded-sm bg-[#151312]" />
              </div>

              {/* Search Box Skeleton */}
              <div className="flex flex-col gap-2">
                <div className="w-24 h-3 rounded-sm bg-[#151312]" />
                <div className="w-full h-11 rounded-sm bg-[#151312] border border-white/5" />
              </div>

              {/* Sort Dropdown Skeleton */}
              <div className="flex flex-col gap-2">
                <div className="w-20 h-3 rounded-sm bg-[#151312]" />
                <div className="w-full h-11 rounded-sm bg-[#151312] border border-white/5" />
              </div>

              {/* Reset Box Skeleton */}
              <div className="pt-2 border-t border-white/5">
                <div className="w-full h-9 rounded-sm bg-[#151312] border border-white/5" />
              </div>
            </div>
          </div>

          {/* Right Column: Groups Grid Skeleton */}
          <div className="w-full lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
            {/* Metric Bar Skeleton */}
            <div className="flex items-center justify-between">
              <div className="w-48 h-3.5 rounded-sm bg-[#1d1b1a]" />
              <div className="w-24 h-3.5 rounded-sm bg-[#1d1b1a]" />
            </div>

            {/* 4 Card Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 w-full">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col justify-between gap-5 shadow-xl h-96"
                >
                  <div className="space-y-4">
                    {/* Top Avatar & Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-sm bg-[#151312] border border-white/5 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="w-32 h-5 rounded-sm bg-[#151312]" />
                          <div className="w-20 h-2.5 rounded-sm bg-[#151312]" />
                        </div>
                      </div>
                      <div className="w-16 h-5 rounded-sm bg-[#151312]" />
                    </div>

                    {/* Short Description */}
                    <div className="w-full h-14 rounded-sm bg-[#151312] border border-white/5" />

                    {/* Date Bar */}
                    <div className="w-36 h-3 rounded-sm bg-[#151312] pt-1" />
                  </div>

                  {/* Team Members */}
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="w-24 h-2.5 rounded-sm bg-[#151312]" />
                    <div className="space-y-1.5">
                      <div className="w-full h-8 rounded-sm bg-[#151312]" />
                      <div className="w-full h-8 rounded-sm bg-[#151312]" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="w-full h-8 rounded-sm bg-[#151312]" />
                      <div className="w-full h-8 rounded-sm bg-[#151312]" />
                    </div>
                    <div className="w-full h-8 rounded-sm bg-[#151312]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
