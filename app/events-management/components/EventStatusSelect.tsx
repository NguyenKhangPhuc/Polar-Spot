"use client";

import React, { useState } from "react";
import { EVENT_STATUS } from "../../types/enum";
import { updateEventStatus } from "../../actions/events";
import { useLoader } from "../../context/LoaderContext";
import { useNotification } from "../../context/NotificationContext";

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
  const { setIsOpenLoader } = useLoader();
  const { showNotification } = useNotification();

  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentStatus || EVENT_STATUS.ONGOING
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangeStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as EVENT_STATUS;
    setSelectedStatus(newStatus);
    setIsUpdating(true);
    setIsOpenLoader(true);

    try {
      const { data, error } = await updateEventStatus(eventId, newStatus);

      if (error || !data) {
        setSelectedStatus(currentStatus || EVENT_STATUS.ONGOING);
        showNotification(error || "Fail to update event status");
        return;
      }

      showNotification("Event status updated successfully");
      onStatusChanged(eventId, newStatus);
    } catch {
      setSelectedStatus(currentStatus || EVENT_STATUS.ONGOING);
      showNotification("Fail to update event status");
    } finally {
      setIsUpdating(false);
      setIsOpenLoader(false);
    }
  };

  const isOngoing = selectedStatus === EVENT_STATUS.ONGOING;

  return (
    <div className="relative inline-flex items-center font-mono">
      <select
        value={selectedStatus}
        onChange={handleChangeStatus}
        disabled={isUpdating}
        className={`px-2.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors border appearance-none pr-6 ${
          isOngoing
            ? "bg-[#00ffec]/10 text-[#00ffec] border-[#00ffec]/30"
            : "bg-white/5 text-[#83958d] border-white/10 hover:bg-white/10"
        } ${isUpdating ? "opacity-50 cursor-wait" : ""}`}
      >
        {Object.entries(EVENT_STATUS).map(([key, val]) => (
          <option key={key} value={val} className="bg-[#151312] text-[#e8e1df]">
            {key.toUpperCase()}
          </option>
        ))}
      </select>
      <svg
        className="w-3.5 h-3.5 absolute right-1.5 pointer-events-none text-[#83958d]"
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
