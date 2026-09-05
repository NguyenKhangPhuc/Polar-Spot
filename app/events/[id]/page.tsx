import React from "react";
import { getSingleEventById } from "@/app/actions/events";
import { getUser } from "@/app/actions/authentication";
import { getProfileById } from "@/app/actions/profile";
import { PROFILE_ROLE } from "@/app/types/enum";
import SingleEventClient from "./SingleEventClient";
import BackButton from "@/app/components/BackButton";

interface SingleEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleEventPage({ params }: SingleEventPageProps) {
  const { id } = await params;
  const [{ data: event, error }, { data: authData }] = await Promise.all([
    getSingleEventById(id),
    getUser(),
  ]);

  const user = authData?.user ?? null;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await getProfileById(user.id);
    const role =
      profile?.role ||
      user.user_metadata?.role ||
      user.app_metadata?.role ||
      null;
    const roleStr = role ? String(role).toLowerCase() : "";
    isAdmin = roleStr === PROFILE_ROLE.ADMIN || roleStr === "admin";
  }

  if (error || !event) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat py-20 px-6 flex flex-col items-center justify-center select-none">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-mono font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight">
              Event Not Found
            </h2>
            <p className="text-xs text-[#b9cbc2] leading-relaxed font-mono">
              {error || "The event record you requested could not be located in the database."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton label="BACK TO EVENTS" href="/events" />
          </div>
        </div>
      </div>
    );
  }

  return <SingleEventClient event={event} isAdmin={isAdmin} />;
}
