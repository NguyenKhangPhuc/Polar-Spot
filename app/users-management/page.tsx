import React from "react";
import { getAllUserProfiles } from "@/app/actions/profile";
import UserManagementClient from "./UserManagementClient";
import BackButton from "@/app/components/BackButton";

export default async function UserManagementPage() {
  const { data: profiles, count, error } = await getAllUserProfiles();

  if (error) {
    return (
      <div className="w-full min-h-screen py-12 px-6 sm:px-10 lg:px-16 space-y-8 select-none text-slate-100 font-sans relative flex flex-col items-center justify-center max-w-7xl mx-auto">
        <div className="bg-[#121212] border border-red-500/30 rounded-md p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-md bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-black font-mono shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight font-sans">
              Failed to Load Users
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-mono">
              {error || "The user profile records could not be fetched from database."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton href="/" label="BACK TO HOME" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserManagementClient
      initialProfiles={profiles || []}
      totalCount={count || 0}
    />
  );
}
