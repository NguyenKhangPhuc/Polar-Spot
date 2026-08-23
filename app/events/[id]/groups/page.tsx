import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import { getGroupsByEventId } from "@/app/actions/groups";
import { createClient } from "@/app/utils/supabase/server";
import EventGroupsClient from "./components/EventGroupsClient";
import BackButton from "@/app/components/BackButton";
import { getProfileById } from "@/app/actions/profile";

interface EventGroupsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventGroupsPage({ params }: EventGroupsPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: string | null =
    user?.user_metadata?.role || user?.app_metadata?.role || null;

  const { data: profile, error } = await getProfileById(user?.id ?? "")
  if (error) {
    <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative flex flex-col items-center justify-center max-w-7xl mx-auto">
      <div className="bg-[#121212] border border-red-500/30 rounded-md p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="w-14 h-14 rounded-md bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-black font-mono shadow-lg">
          !
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Event Groups Not Found
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-mono">
            {error || "The event record or registered groups could not be loaded."}
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <BackButton href={`/events/${id}`} label="BACK TO EVENT DETAILS" />
        </div>
      </div>
    </div>
  }
  const roleStr = profile!.role;
  const canGrade =
    roleStr === "admin" || roleStr === "judge";

  const [eventRes, groupsRes] = await Promise.all([
    getSingleEventById(id),
    getGroupsByEventId(id),
  ]);

  const event = eventRes.data;
  const groups = groupsRes.data;
  const serverError = eventRes.error || groupsRes.error;

  if (serverError || !event) {
    return (
      <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative flex flex-col items-center justify-center max-w-7xl mx-auto">
        <div className="bg-[#121212] border border-red-500/30 rounded-md p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-md bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-black font-mono shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight font-sans">
              Event Groups Not Found
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-mono">
              {serverError || "The event record or registered groups could not be loaded."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton href={`/events/${id}`} label="BACK TO EVENT DETAILS" />
          </div>
        </div>
      </div>
    );
  }

  return <EventGroupsClient event={event} groups={groups || []} canGrade={canGrade} profile={profile!} />;
}
