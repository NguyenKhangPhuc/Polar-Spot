import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import { getGroupsByEventId } from "@/app/actions/groups";
import EventGroupsClient from "./components/EventGroupsClient";
import BackButton from "@/app/components/BackButton";

/**
 * PURPOSE:
 * Server Component for viewing pitching groups registered for a specific event at 'app/events/[id]/groups/page.tsx'.
 * Concurrently fetches event details via getSingleEventById and registered groups (with member profiles) via getGroupsByEventId.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/[id]/groups/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Route parameter object containing event UUID.
 */

interface EventGroupsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventGroupsPage({ params }: EventGroupsPageProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Awaits params Promise, concurrently fetches event record and registered groups.
   * If error occurs or event is missing, renders an Arctic Cyber-Frost 404 error card with a back button.
   * Otherwise passes resolved event and groups data to EventGroupsClient.
   *
   * PARAMETERS:
   * - props (EventGroupsPageProps): Page props object.
   *
   * RETURNS:
   * - JSX.Element: Rendered EventGroupsClient or error feedback UI.
   */
  const { id } = await params;

  const [eventRes, groupsRes] = await Promise.all([
    getSingleEventById(id),
    getGroupsByEventId(id),
  ]);

  const event = eventRes.data;
  const groups = groupsRes.data;
  const serverError = eventRes.error || groupsRes.error;

  if (serverError || !event) {
    return (
      <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 select-none text-slate-100 font-sans relative flex flex-col items-center justify-center">
        <div className="bg-[#13243b] border border-red-500/30 rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-2xl font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Event Groups Not Found
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {serverError || "The event record or registered groups could not be loaded."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton />
          </div>
        </div>
      </div>
    );
  }

  return <EventGroupsClient event={event} groups={groups || []} />;
}
