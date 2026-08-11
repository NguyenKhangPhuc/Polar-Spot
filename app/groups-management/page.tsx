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
      <div className="w-full min-h-[70vh] flex items-center justify-center p-6">
        <div className="frost-card rounded-2xl p-8 max-w-md w-full text-center space-y-5 border border-red-500/30 bg-[#13243b]/90 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Failed to Load Groups Portal</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {serverError || "An error occurred while connecting to the database server."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/groups-management"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-sky-100 transition-colors"
            >
              Retry Loading
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GroupManagementClient
      initialGroups={initialGroups}
      eventsList={eventsList}
    />
  );
}
