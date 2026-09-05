import React from "react";
import { getAllUserProfiles } from "@/app/actions/profile";
import UserManagementClient from "./UserManagementClient";
import BackButton from "@/app/components/BackButton";

export default async function UserManagementPage() {
  const { data: profiles, count, error } = await getAllUserProfiles();

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono py-24 px-6 md:px-16 flex flex-col items-center justify-center select-none">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight">
              Failed to Load Users
            </h2>
            <p className="text-xs text-[#b9cbc2] leading-relaxed">
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
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <UserManagementClient
          initialProfiles={profiles || []}
          totalCount={count || 0}
        />
      </div>
    </div>
  );
}
