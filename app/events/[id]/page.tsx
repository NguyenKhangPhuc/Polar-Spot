import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import SingleEventClient from "./components/SingleEventClient";
import BackButton from "@/app/components/BackButton";

/**
 * PURPOSE:
 * Server Component for viewing a single event at 'app/events/[id]/page.tsx'.
 * Fetches event data by ID using getSingleEventById server action and renders SingleEventClient.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/[id]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Route parameter object containing event UUID.
 */

interface SingleEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleEventPage({ params }: SingleEventPageProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Awaits params Promise, calls getSingleEventById server action to fetch target event record.
   * If error occurs or event is missing, renders an Arctic Cyber-Frost 404 error card with a back button.
   * Otherwise passes resolved event data to SingleEventClient.
   *
   * PARAMETERS:
   * - props (SingleEventPageProps): Page props object.
   *
   * RETURNS:
   * - JSX.Element: Rendered SingleEventClient or error feedback UI.
   */
  const { id } = await params;
  const { data: event, error } = await getSingleEventById(id);

  if (error || !event) {
    return (
      <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100 font-sans relative flex flex-col items-center justify-center">
        <div className="bg-[#13243b] border border-red-500/30 rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-2xl font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Event Not Found
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {error || "The event record you requested could not be located in the database."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton />
          </div>
        </div>
      </div>
    );
  }

  return <SingleEventClient event={event} />;
}
