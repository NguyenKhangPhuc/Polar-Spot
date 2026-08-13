import { getUser } from "@/app/actions/authentication";
import NavigationBarClient from "./NavigationBarClient";
import NavigationBarMobile from "./NavigationBarMobile";

export default async function Navbar() {
  const { data } = await getUser();
  const user = data?.user ?? null;

  return (
    <>
      <NavigationBarClient user={user} />
      <NavigationBarMobile user={user} />
    </>
  );
}
