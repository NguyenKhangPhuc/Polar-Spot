import React from "react";

export default function NavbarSkeleton() {
  return (
    <>
      {/* Desktop Sidebar Skeleton */}
      <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 bottom-0 w-64 bg-[#151312]/95 backdrop-blur-xl border-r border-white/5 z-40 p-6 overflow-y-auto font-montserrat select-none">
        {/* Brand Logo & Name Skeleton */}
        <div className="mb-8 flex flex-col justify-start pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-sm bg-white/5 border border-white/5 animate-pulse shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-5 w-28 bg-white/5 rounded-sm animate-pulse" />
              <div className="h-2.5 w-20 bg-white/5 rounded-sm animate-pulse" />
            </div>
          </div>
        </div>

        {/* Categorized Navigation Skeleton */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-20 bg-white/5 rounded-sm animate-pulse mx-4 mb-1" />
            <div className="flex flex-col gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={`skeleton-base-${i}`}
                  className="h-11 w-full bg-white/5 rounded-sm animate-pulse"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-white/5 rounded-sm animate-pulse mx-4 mb-1" />
            <div className="flex flex-col gap-1.5">
              {[1, 2].map((i) => (
                <div
                  key={`skeleton-admin-${i}`}
                  className="h-11 w-full bg-white/5 rounded-sm animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Auth Action Skeleton */}
        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="h-10 w-full bg-white/5 rounded-sm animate-pulse" />
          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
            <div className="h-2.5 w-24 bg-white/5 rounded-sm animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar Skeleton */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 bg-[#151312]/95 backdrop-blur-xl border-b border-white/5 h-16 select-none font-montserrat">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/5 animate-pulse shrink-0" />
          <div className="h-5 w-28 bg-white/5 rounded-sm animate-pulse" />
        </div>
        <div className="w-9 h-9 rounded-sm bg-white/5 animate-pulse" />
      </header>
    </>
  );
}
