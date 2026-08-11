"use client";

import React, { useState } from "react";
import { EVENT_STATUS } from "../../types/enum";
import { updateEventStatus } from "../../actions/events";

/**
 * PURPOSE:
 * Interactive status dropdown rendered inside events table rows. Allows instant updating of an event's status.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events-management/EventsManagementClient.tsx to encapsulate status modification logic and server action execution.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of the target event.
 * - currentStatus (string | null, Required): Active status value of the event.
 * - onStatusChanged (function, Required): Callback invoked after successful server status update.
 */

interface EventStatusSelectProps {
  eventId: string;
  currentStatus: string | null;
  onStatusChanged: (eventId: string, newStatus: EVENT_STATUS) => void;
}

export function EventStatusSelect({
  eventId,
  currentStatus,
  onStatusChanged,
}: EventStatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentStatus || EVENT_STATUS.ONGOING
  );
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers updateEventStatus server action when the dropdown selection changes.
   * Optimistically updates local UI state, handles loading states, and reports changes to parent.
   *
   * PARAMETERS:
   * - e (React.ChangeEvent<HTMLSelectElement>): Dropdown change event.
   *
   * RETURNS:
   * - Promise<void>: Asynchronous update execution.
   */
  const handleChangeStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as EVENT_STATUS;
    setSelectedStatus(newStatus);
    setIsUpdating(true);

    const { data, error } = await updateEventStatus(eventId, newStatus);
    setIsUpdating(false);

    if (error || !data) {
      // Rollback to original status if server update fails
      setSelectedStatus(currentStatus || EVENT_STATUS.ONGOING);
      alert(error || "Fail to update event status");
      return;
    }

    onStatusChanged(eventId, newStatus);
  };

  const isOngoing = selectedStatus === EVENT_STATUS.ONGOING;

  return (
    <div className="relative inline-flex items-center">
      <select
        value={selectedStatus}
        onChange={handleChangeStatus}
        disabled={isUpdating}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors border appearance-none pr-7 ${
          isOngoing
            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80"
            : "bg-slate-800 text-slate-300 border-slate-600/40 hover:bg-slate-700"
        } ${isUpdating ? "opacity-50 cursor-wait" : ""}`}
      >
        {Object.entries(EVENT_STATUS).map(([key, val]) => (
          <option key={key} value={val} className="bg-[#13243b] text-white">
            {key.toUpperCase()}
          </option>
        ))}
      </select>
      <svg
        className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

export default EventStatusSelect;
