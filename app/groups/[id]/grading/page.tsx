import { notFound, redirect } from "next/navigation";
import { getUser } from "@/app/actions/authentication";
import { getGroupByGroupId } from "@/app/actions/groups";
import { getSingleEventById } from "@/app/actions/events";
import { getEventCriteriaByEventId } from "@/app/actions/event_grading_criteria";
import { getUserGroupGradingByGroupAndUserId } from "@/app/actions/user_group_grading";
import GroupGradingClient from "./GroupGradingClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const groupId = resolvedParams.id;

  // 1. Authenticate user
  const { data: userData } = await getUser();
  if (!userData?.user) {
    redirect("/login");
  }
  const userId = userData.user.id;

  // 2. Fetch group by ID
  const { data: group, error: groupError } = await getGroupByGroupId(groupId);
  if (groupError || !group) {
    notFound();
  }

  // 3. Concurrently fetch event, event grading criteria, and existing user gradings via Promise.all
  const [{ data: event }, { data: criteriaData }, { data: existingGradings }] =
    await Promise.all([
      group.event_id
        ? getSingleEventById(group.event_id)
        : Promise.resolve({ data: null, error: null }),
      group.event_id
        ? getEventCriteriaByEventId(group.event_id)
        : Promise.resolve({ data: [], error: null }),
      getUserGroupGradingByGroupAndUserId(group.id, userId),
    ]);

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <GroupGradingClient
          group={group}
          event={event || null}
          criteriaList={criteriaData || []}
          existingGradings={existingGradings || []}
          userId={userId}
        />
      </div>
    </div>
  );
}
