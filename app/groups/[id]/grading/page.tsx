import { notFound, redirect } from "next/navigation";
import { getUser } from "@/app/actions/authentication";
import { getGroupByGroupId } from "@/app/actions/groups";
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

  // 3. Fetch event grading criteria for group's event
  let criteriaList: any[] = [];
  if (group.event_id) {
    const { data: criteriaData } = await getEventCriteriaByEventId(group.event_id);
    if (criteriaData) {
      criteriaList = criteriaData;
    }
  }

  // 4. Fetch existing grading records for this user and group
  const { data: existingGradings } = await getUserGroupGradingByGroupAndUserId(
    group.id,
    userId
  );

  return (
    <div className="w-full min-h-screen polar-snow-bg text-slate-100 flex flex-col py-12 px-6 sm:px-10 lg:px-16 select-none font-sans relative max-w-7xl mx-auto">
      <GroupGradingClient
        group={group}
        criteriaList={criteriaList}
        existingGradings={existingGradings || []}
        userId={userId}
      />
    </div>
  );
}
