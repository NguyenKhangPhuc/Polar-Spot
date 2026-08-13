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
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Criteria Input Form */}
      <div className="w-full pb-6 border-b border-white/12">
        <form className="bg-[#13243b]/90 border border-white/18 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 w-full shadow-xl">
          <div className="flex items-center justify-between border-b border-white/12 pb-3">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              GRADING CRITERIA DEFINITION
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Criteria Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                CRITERIA NAME <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PITCH INNOVATION & VIABILITY"
                className={`bg-[#0a1526] text-white border text-sm p-3.5 rounded-xl w-full outline-none transition-colors ${errors.name
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/15 focus:border-white/50"
                  }`}
                {...register("name", { required: "Criteria Name is required" })}
              />
              {errors.name && (
                <span className="text-xs text-red-400 font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                SHORT DESCRIPTION <span className="text-red-400">*</span>
              </label>
              <textarea
                placeholder="Describe evaluation metrics, scoring rules, and expectations..."
                rows={3}
                className={`bg-[#0a1526] text-white border text-sm p-3.5 rounded-xl w-full outline-none transition-colors resize-none ${errors.short_description
                  ? "border-red-500/70 focus:border-red-400"
                  : "border-white/15 focus:border-white/50"
                  }`}
                {...register("short_description", { required: "Description is required" })}
              />
              {errors.short_description && (
                <span className="text-xs text-red-400 font-medium">
                  {errors.short_description.message}
                </span>
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex gap-3 select-none justify-end mt-2 pt-4 border-t border-white/12">
            <button
              type="button"
              onClick={handleSubmit(handleSaveCriteria)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              SAVE_CHANGES
            </button>
            <button
              type="button"
              onClick={handleSubmit(handleAddingCriteria)}
              className="px-5 py-2.5 bg-white hover:bg-sky-100 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              + CREATE_CRITERIA
            </button>
          </div>
        </form>
      </div>

      {/* Criteria List Grid */}
      {criteriaList.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
          {criteriaList.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => handleChooseEventCriteria(item)}
              className="bg-[#13243b]/90 border border-white/18 rounded-2xl p-5 hover:border-cyan-400/50 transition-all cursor-pointer flex flex-col gap-3 min-h-[140px] relative group shadow-lg"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/12 pb-2 select-none">
                <span className="font-bold text-sm text-white truncate">
                  {item.name?.toUpperCase() || "UNTITLED_CRITERIA"}
                </span>
              </div>

              {/* Description Content */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 select-text">
                {item.short_description || "No description registry parameters provided."}
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  [EDIT_MODULE]
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-sm font-medium text-slate-400 italic bg-[#13243b]/50 border border-white/10 rounded-2xl">
          NO GRADING CRITERIA DEFINED FOR THIS EVENT YET
        </div>
      )}
    </div>
  );
}
