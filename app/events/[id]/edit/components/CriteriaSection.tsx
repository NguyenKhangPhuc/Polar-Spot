"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Criteria, CriteriaInsert } from "@/app/types/event_criteria";
import { createCriteria, updateEventCriteria } from "@/app/actions/event_grading_criteria";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";

/**
 * PURPOSE:
 * Renders the grading criteria configuration panel for an event.
 * Supports adding new criteria parameters, selecting existing items into the form for editing,
 * and saving modifications.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent of app/events/[id]/edit/EditEventClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - receivedCriteria (Criteria[], Required): Preloaded event grading criteria list.
 * - eventId (string, Required): The target event ID string.
 * - page (string, Required): Active configuration tab view state.
 */

interface CriteriaSectionProps {
  receivedCriteria: Array<Criteria>;
  eventId: string;
  page: string;
}

export default function CriteriaSection({
  receivedCriteria,
  eventId,
  page,
}: CriteriaSectionProps) {
  const [criteriaList, setCriteriaList] = useState<Array<Criteria>>(receivedCriteria);
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CriteriaInsert>();

  /**
   * BEHAVIORAL MECHANISM:
   * Adds a newly defined grading criteria record. Spawns database insertion and appends to the criteria list.
   *
   * PARAMETERS:
   * - newCriteria (CriteriaInsert): Criteria form values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleAddingCriteria = async (newCriteria: CriteriaInsert): Promise<void> => {
    setIsOpenLoader(true);
    console.log(newCriteria)
    newCriteria.event_id = eventId
    newCriteria.id = undefined
    try {
      const { data, error } = await createCriteria(newCriteria);
      if (error || !data) {
        throw new Error(error || "Failed to create criteria.");
      }
      setCriteriaList((prev) => [...prev, data]);
      reset({
        name: "",
        short_description: "",
      });
      showNotification("Create criteria successfully");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message);
      } else {
        showNotification("Failed to create criteria.");
      }
    } finally {
      setIsOpenLoader(false);
    }
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Loads an existing criteria item's fields into the active input form for quick editing.
   *
   * PARAMETERS:
   * - existedCriteria (Criteria): Selected criteria record.
   *
   * RETURNS:
   * - void
   */
  const handleChooseEventCriteria = (existedCriteria: Criteria): void => {
    reset({
      id: existedCriteria.id,
      event_id: existedCriteria.event_id,
      name: existedCriteria.name || "",
      short_description: existedCriteria.short_description || "",
    });
  };

  /**
   * BEHAVIORAL MECHANISM:
   * Saves edits to the currently selected criteria item by triggering database update.
   *
   * PARAMETERS:
   * - existedCriteria (CriteriaInsert): Modified criteria form values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSaveCriteria = async (existedCriteria: CriteriaInsert): Promise<void> => {
    if (!existedCriteria.id) {
      showNotification("Please select an existing criteria block from the list to update.");
      return;
    }
    setIsOpenLoader(true);
    try {
      const { error } = await updateEventCriteria({ updatedCriteria: existedCriteria });
      if (error) {
        throw new Error(error);
      }
      setCriteriaList((prev) =>
        prev.map((ele) =>
          ele.id === existedCriteria.id
            ? ({ ...ele, ...existedCriteria } as Criteria)
            : ele
        )
      );
      showNotification("Update criteria successfully");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message);
      } else {
        showNotification("Failed to save criteria.");
      }
    } finally {
      setIsOpenLoader(false);
    }
  };

  if (page !== "criteria") {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-8 select-text font-mono">
      {/* Criteria Input Form */}
      <form className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 flex flex-col gap-5 w-full shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffec]/50" />

        <div className="flex items-center justify-between border-b border-white/5 pb-3 select-none">
          <span className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider flex items-center gap-2 font-mono">
            <span className="w-[3px] h-3 bg-[#00ffec]" />
            GRADING CRITERIA DEFINITION
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Criteria Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              CRITERIA NAME <span className="text-[#00ffec]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. PITCH INNOVATION & VIABILITY"
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors placeholder:text-[#83958d]/40 ${
                errors.name
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("name", { required: "Criteria Name is required" })}
            />
            {errors.name && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              SHORT DESCRIPTION <span className="text-[#00ffec]">*</span>
            </label>
            <textarea
              placeholder="Describe evaluation metrics, scoring rules, and expectations..."
              rows={3}
              className={`bg-[#151312] text-[#e8e1df] border font-mono text-xs p-3 rounded-sm w-full outline-none transition-colors resize-none placeholder:text-[#83958d]/40 ${
                errors.short_description
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/5 focus:border-[#00ffec]/50"
              }`}
              {...register("short_description", { required: "Description is required" })}
            />
            {errors.short_description && (
              <span className="text-[10px] text-red-400 font-mono">
                {errors.short_description.message}
              </span>
            )}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex gap-3 select-none justify-end mt-2 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleSubmit(handleSaveCriteria)}
            className="px-5 py-2.5 bg-[#151312] hover:bg-[#252220] border border-[#00ffec]/40 text-[#00ffec] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 font-mono"
          >
            SAVE CHANGES
          </button>
          <button
            type="button"
            onClick={handleSubmit(handleAddingCriteria)}
            className="px-5 py-2.5 bg-[#00ffec] hover:brightness-110 text-[#00382b] text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#00ffec]/20 font-mono"
          >
            + CREATE CRITERIA
          </button>
        </div>
      </form>

      {/* Criteria List Header & Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider select-none">
          <div className="w-[3px] h-3 bg-[#00ffec]" />
          <span>DEFINED CRITERIA ({criteriaList.length})</span>
        </div>

        {criteriaList.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criteriaList.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleChooseEventCriteria(item)}
                className="bg-[#1d1b1a] border border-white/5 rounded-sm p-5 hover:border-[#00ffec]/40 hover:bg-[#252220] transition-all cursor-pointer flex flex-col gap-3 min-h-[130px] relative group shadow-lg font-mono"
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-2 select-none">
                  <span className="font-bold text-xs text-[#e8e1df] uppercase tracking-wider truncate">
                    {item.name || "UNTITLED CRITERIA"}
                  </span>
                  <span className="text-[8px] font-bold text-[#00ffec] uppercase tracking-widest bg-[#151312] px-2 py-0.5 rounded-sm border border-white/5 shrink-0 ml-2">
                    CLICK TO EDIT
                  </span>
                </div>

                {/* Description Content */}
                <p className="text-[10px] text-[#83958d] leading-relaxed line-clamp-4 select-text font-mono">
                  {item.short_description || "No description registry parameters provided."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs font-bold text-[#83958d] uppercase tracking-wider bg-[#1d1b1a] border border-white/5 rounded-sm font-mono shadow-xl">
            NO GRADING CRITERIA DEFINED FOR THIS EVENT YET
          </div>
        )}
      </div>
    </div>
  );
}
