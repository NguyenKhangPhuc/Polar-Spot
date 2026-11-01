import { getUser } from "@/app/actions/authentication";
import { getProfileById } from "@/app/actions/profile";
import { PROFILE_ROLE } from "@/app/types/enum";
import NavigationBarClient from "./NavigationBarClient";
import NavigationBarMobile from "./NavigationBarMobile";

export default async function NavbarServer() {
  const { data } = await getUser();
  const user = data?.user ?? null;

  let isAdmin = false;
  let isJudge = false;

  if (user) {
    const { data: profile } = await getProfileById(user.id);
    const role =
      profile?.role ||
      user.user_metadata?.role ||
      user.app_metadata?.role ||
      null;

    const roleStr = role ? String(role).toLowerCase() : "";
    isAdmin = roleStr === PROFILE_ROLE.ADMIN || roleStr === "admin";
    isJudge = roleStr === PROFILE_ROLE.JUDGES || roleStr === "judge";
  }

  return (
    <>
      <NavigationBarClient user={user} isAdmin={isAdmin} isJudge={isJudge} />
      <NavigationBarMobile user={user} isAdmin={isAdmin} isJudge={isJudge} />
    </>
  );
}
