"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Event } from "../../types/event";
import { EVENT_STATUS } from "../../types/enum";
import EventStatusSelect from "./EventStatusSelect";

interface EventsTableProps {
  events: Event[];
  onStatusUpdated: (eventId: string, newStatus: EVENT_STATUS) => void;
}

export function EventsTable({ events, onStatusUpdated }: EventsTableProps) {
  return (
    <div className="bg-[#1d1b1a] border border-white/5 rounded-sm overflow-x-auto shadow-xl">
      <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[950px]">
        <thead>
          <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider font-bold">
            <th className="p-4 text-center w-14">NO</th>
            <th className="p-4 min-w-[220px]">EVENT TITLE</th>
            <th className="p-4 text-center w-36">STATUS</th>
            <th className="p-4 min-w-[110px]">START DATE</th>
            <th className="p-4 min-w-[110px]">END DATE</th>
            <th className="p-4 min-w-[140px]">ORGANIZED DATETIME</th>
            <th className="p-4 min-w-[150px]">LOCATION STAGE</th>
            <th className="p-4 text-center w-40">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {events.length > 0 ? (
              events.map((event, index) => {
                const eventTitle =
                  typeof (event as any).title === "string" && (event as any).title.trim()
                    ? (event as any).title
                    : typeof event.short_description === "string" && event.short_description.trim()
                    ? event.short_description
                    : "UNTITLED EVENT";

                const formatDate = (dateStr: string | null | undefined) => {
                  if (!dateStr) return "NOT SET";
                  return new Date(dateStr).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }).toUpperCase();
                };

                const formatDateTime = (dateStr: string | null | undefined) => {
                  if (!dateStr) return "NOT SET";
                  return new Date(dateStr).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).toUpperCase();
                };

                return (
                  <tr
                    key={event.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors group"
                  >
                    {/* Index */}
                    <td className="p-4 text-center font-bold text-[#83958d]">
                      {String(index + 1).padStart(3, "0")}
                    </td>

                    {/* Event Title */}
                    <td className="p-4 text-[#e8e1df] font-bold max-w-[260px] truncate">
                      <Link
                        href={`/events/${event.id}`}
                        className="hover:text-[#00ffec] hover:underline transition-colors flex items-center gap-1.5"
                        title="View Event Details"
                      >
                        <span className="truncate">{eventTitle}</span>
                        <svg
                          className="w-3.5 h-3.5 text-[#00ffec] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4 text-center w-36 select-none">
                      <EventStatusSelect
                        eventId={event.id}
                        currentStatus={event.status}
                        onStatusChanged={onStatusUpdated}
                      />
                    </td>

                    {/* Start Date */}
                    <td className="p-4 text-[#83958d] whitespace-nowrap">
                      {formatDate(event.start_date)}
                    </td>

                    {/* End Date */}
                    <td className="p-4 text-[#83958d] whitespace-nowrap">
                      {formatDate(event.end_date)}
                    </td>

                    {/* Organized Datetime */}
                    <td className="p-4 text-[#83958d] whitespace-nowrap">
                      {formatDateTime(event.organized_date)}
                    </td>

                    {/* Location */}
                    <td className="p-4 text-[#b9cbc2] max-w-[180px] truncate uppercase">
                      {typeof event.location === "string" && event.location.trim()
                        ? event.location
                        : "NOT SPECIFIED"}
                    </td>

                    {/* Action Column */}
                    <td className="p-4 text-center w-40 select-none">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="px-2.5 py-1.5 rounded-sm bg-[#00ffec] hover:brightness-110 text-[#00382b] font-bold text-[9px] uppercase tracking-wider transition-all"
                          title="View Details"
                        >
                          VIEW
                        </Link>
                        <Link
                          href={`/events/${event.id}/edit`}
                          className="px-2.5 py-1.5 rounded-sm bg-[#151312] hover:bg-[#252220] text-[#e8e1df] border border-white/10 hover:border-[#00ffec]/40 text-[9px] font-bold uppercase tracking-wider transition-all"
                          title="Edit Event"
                        >
                          EDIT
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="p-12 text-center text-[#83958d] select-none text-xs font-mono"
                >
                  NO EVENT REGISTRY ENTRIES MATCHING ACTIVE FILTER PARAMETERS
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

export default EventsTable;
