"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Event } from "../../types/event";
import { EVENT_STATUS } from "../../types/enum";
import EventStatusSelect from "./EventStatusSelect";

/**
 * PURPOSE:
 * Renders tabular display of events records, incorporating the interactive status dropdown and action columns.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events-management/EventsManagementClient.tsx to isolate table structure, data mapping, and empty state UI.
 *
 * INPUTS / PARAMETERS:
 * - events (Event[], Required): Array of event records to render in the table.
 * - onStatusUpdated (function, Required): Callback invoked when an event's status is changed.
 */

interface EventsTableProps {
  events: Event[];
  onStatusUpdated: (eventId: string, newStatus: EVENT_STATUS) => void;
}

export function EventsTable({ events, onStatusUpdated }: EventsTableProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Maps through events array to display standard table columns. Integrates EventStatusSelect for status editing
   * and renders empty state feedback if no events match active filter parameters.
   *
   * PARAMETERS:
   * - props (EventsTableProps): Object containing events list and onStatusUpdated handler.
   *
   * RETURNS:
   * - JSX.Element: Rendered HTML table element.
   */
  return (
    <div className="bg-[#13243b]/90 border border-white/18 rounded-2xl overflow-x-auto shadow-xl">
      <table className="w-full border-collapse text-sm text-slate-200 text-left min-w-[950px]">
        <thead>
          <tr className="border-b border-white/15 bg-[#0a1526] text-slate-300 select-none text-xs uppercase tracking-wider font-bold">
            <th className="p-4 sm:p-5 text-center w-14">NO</th>
            <th className="p-4 sm:p-5">EVENT_TITLE</th>
            <th className="p-4 sm:p-5 text-center w-40">STATUS</th>
            <th className="p-4 sm:p-5">START_DATE</th>
            <th className="p-4 sm:p-5">END_DATE</th>
            <th className="p-4 sm:p-5">ORGANIZED_DATE</th>
            <th className="p-4 sm:p-5">LOCATION</th>
            <th className="p-4 sm:p-5 text-center w-40">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr
                  key={event.id}
                  className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors"
                >
                  {/* Index */}
                  <td className="p-4 sm:p-5 text-center font-bold text-slate-400">
                    {String(index + 1).padStart(3, "0")}
                  </td>

                  {/* Event Title */}
                  <td className="p-4 sm:p-5 text-white font-bold text-base">
                    {typeof event.short_description === "string"
                      ? event.short_description
                      : typeof event.content === "string"
                      ? event.content
                      : "UNTITLED_EVENT"}
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

                  {/* Action Column: Edit Event */}
                  <td className="p-4 sm:p-5 text-center w-40">
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="inline-block px-4 py-2 rounded-xl bg-white/15 hover:bg-white/30 text-white border border-white/25 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      EDIT EVENT
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="p-16 text-center text-slate-400 select-none text-base"
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
