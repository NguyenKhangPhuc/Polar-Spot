import React from "react";
import { fetchAllFeedbacksByGroupId } from "@/app/actions/group_feedbacks";
import { getGroupByGroupId } from "@/app/actions/groups";
import FeedbacksClient from "./FeedbacksClient";
import BackButton from "@/app/components/BackButton";

interface GroupFeedbacksPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupFeedbacksPage({ params }: GroupFeedbacksPageProps) {
  const { id } = await params;

  const [feedbacksRes, groupRes] = await Promise.all([
    fetchAllFeedbacksByGroupId(id),
    getGroupByGroupId(id),
  ]);

  const feedbacks = feedbacksRes.data;
  const group = groupRes.data;
  const serverError = feedbacksRes.error || groupRes.error;

  if (serverError || !group) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24 select-none relative flex flex-col items-center justify-center">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-bold font-mono shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#e8e1df] tracking-tight font-mono uppercase">
              Group Feedbacks Not Found
            </h2>
            <p className="text-xs text-[#83958d] leading-relaxed font-mono">
              {serverError || "The group record or feedback entries could not be loaded."}
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton href="/events" label="BACK TO EVENTS" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <FeedbacksClient feedbacks={feedbacks || []} group={group} />
      </div>
    </div>
  );
}
