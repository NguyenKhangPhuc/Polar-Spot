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
    <div className="bg-[#121212] border border-white/12 rounded-md overflow-x-auto shadow-xl">
      <table className="w-full border-collapse font-mono text-xs text-slate-200 text-left min-w-[950px]">
        <thead>
          <tr className="border-b border-white/12 bg-[#000000] text-[#3be1fe] select-none text-[11px] uppercase tracking-wider font-bold">
            <th className="p-4 sm:p-5 text-center w-14">NO</th>
            <th className="p-4 sm:p-5">EVENT_TITLE</th>
            <th className="p-4 sm:p-5 text-center w-40">STATUS</th>
            <th className="p-4 sm:p-5">START_DATE</th>
            <th className="p-4 sm:p-5">END_DATE</th>
            <th className="p-4 sm:p-5">ORGANIZED_DATE</th>
            <th className="p-4 sm:p-5">LOCATION</th>
            <th className="p-4 sm:p-5 text-center w-52">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {events.length > 0 ? (
              events.map((event, index) => {
                const eventTitle =
                  typeof event.short_description === "string"
                    ? event.short_description
                    : typeof event.content === "string"
                    ? event.content
                    : "UNTITLED_EVENT";

                return (
                  <tr
                    key={event.id}
                    className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors group"
                  >
                    {/* Index */}
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-500">
                      {String(index + 1).padStart(3, "0")}
                    </td>

                    {/* Event Title (Clickable Navigation to /events/[id]) */}
                    <td className="p-4 sm:p-5 text-white font-bold text-sm max-w-[260px] truncate">
                      <Link
                        href={`/events/${event.id}`}
                        className="hover:text-[#3be1fe] hover:underline transition-colors flex items-center gap-1.5"
                        title="View Event Details"
                      >
                        <span className="truncate">{eventTitle}</span>
                        <svg className="w-3.5 h-3.5 text-[#3be1fe] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4 sm:p-5 text-center w-40">
                      <EventStatusSelect
                        eventId={event.id}
                        currentStatus={event.status}
                        onStatusChanged={onStatusUpdated}
                      />
                    </td>

                    {/* Dates */}
                    <td className="p-4 sm:p-5 text-slate-300 whitespace-nowrap">
                      {event.start_date
                        ? new Date(event.start_date).toLocaleDateString()
                        : "NOT_SET"}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300 whitespace-nowrap">
                      {event.end_date
                        ? new Date(event.end_date).toLocaleDateString()
                        : "NOT_SET"}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300 whitespace-nowrap">
                      {event.organized_date
                        ? new Date(event.organized_date).toLocaleDateString()
                        : "NOT_SET"}
                    </td>

                    {/* Location */}
                    <td className="p-4 sm:p-5 text-white max-w-[180px] truncate uppercase font-medium">
                      {typeof event.location === "string" ? event.location : "NOT_SPECIFIED"}
                    </td>

                    {/* Action Column: View Details & Edit Event */}
                    <td className="p-4 sm:p-5 text-center w-52">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="px-3 py-1.5 rounded-md bg-[#3be1fe] hover:bg-[#6ee7fc] text-black font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                          title="View Details"
                        >
                          VIEW
                        </Link>
                        <Link
                          href={`/events/${event.id}/edit`}
                          className="px-3 py-1.5 rounded-md bg-[#000000] hover:bg-[#18181b] text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
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
                  className="p-16 text-center text-slate-400 select-none text-xs italic"
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
