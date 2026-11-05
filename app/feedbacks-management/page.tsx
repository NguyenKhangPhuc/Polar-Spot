import React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/authentication";
import { getProfileById, getUserRole } from "@/app/actions/profile";
import { getEvaluatorFeedbacks } from "@/app/actions/group_feedbacks";
import { PROFILE_ROLE } from "@/app/types/enum";
import FeedbacksManagementClient from "./FeedbacksManagementClient";
import BackButton from "@/app/components/BackButton";

export const metadata = {
  title: "Feedbacks Management | POLAR SPOT",
  description: "Dashboard for evaluators, judges, and admins to review and edit submitted group feedbacks.",
};

export default async function FeedbacksManagementPage() {
  const authRes = await getUser();
  const user = authRes.data?.user ?? null;

  if (!user) {
    redirect("/login");
  }

  const [role, profileRes] = await Promise.all([
    getUserRole(user.id),
    getProfileById(user.id),
  ]);

  const roleStr = role ? String(role).toLowerCase() : "";
  const isAdmin = roleStr === PROFILE_ROLE.ADMIN || roleStr === "admin";
  const isJudge = roleStr === PROFILE_ROLE.JUDGES || roleStr === "judge";

  if (!isAdmin && !isJudge) {
    redirect("/");
  }

  const feedbacksRes = await getEvaluatorFeedbacks(user.id);
  const feedbacks = feedbacksRes.data || [];
  const profile = profileRes.data;

  if (!profile) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono py-24 px-6 md:px-16 flex flex-col items-center justify-center select-none">
        <div className="bg-[#1d1b1a] border border-red-500/30 rounded-sm p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-sm bg-red-950/40 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-xl font-black shadow-lg">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#e8e1df] tracking-tight">
              Profile Not Found
            </h2>
            <p className="text-xs text-[#b9cbc2] leading-relaxed">
              Your evaluator profile could not be loaded. Please log in again.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <BackButton fallbackHref="/" label="BACK" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <FeedbacksManagementClient
      initialFeedbacks={feedbacks}
      profile={profile}
      isAdmin={isAdmin}
      isJudge={isJudge}
    />
  );
}
