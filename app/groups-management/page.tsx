import { getAllGroupsWithMembersWithEvent } from "../actions/groups";
import { getAllEvents } from "../actions/events";
import GroupManagementClient from "./GroupManagementClient";
import Link from "next/link";

export const metadata = {
  title: "Groups Management | Polar-Spot",
  description: "Admin portal for managing Polar Bear Pitching teams, pitching groups, events, and member rosters.",
};

export default async function GroupsManagementPage() {
  // Concurrently fetch groups with member/event joins AND all events list
  const [groupsRes, eventsRes] = await Promise.all([
    getAllGroupsWithMembersWithEvent(),
    getAllEvents(),
  ]);

  const initialGroups = groupsRes.data;
  const groupsError = groupsRes.error;
  const eventsList = eventsRes.data;
  const eventsError = eventsRes.error;

  const serverError = groupsError || eventsError;

  // Handle server-side data loading error directly in page.tsx
  if (serverError || !initialGroups || !eventsList) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono py-24 px-6 md:px-16 flex flex-col items-center justify-center select-none">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight">
              Failed to Load Groups
            </h2>
            <p className="text-xs text-[#b9cbc2] leading-relaxed">
              {serverError || "An error occurred while connecting to the database server."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <Link
              href="/groups-management"
              className="px-5 py-2.5 rounded-sm text-xs font-mono font-bold text-[#00382b] bg-[#00ffec] hover:brightness-110 uppercase tracking-wider transition-all"
            >
              Retry Loading
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <GroupManagementClient
          initialGroups={initialGroups}
          eventsList={eventsList}
        />
      </div>
    </div>
  );
}
