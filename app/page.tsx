import SnowEffect from "./components/home/SnowEffect";
import HeroSection from "./components/home/HeroSection";
import GroupsListSection from "./components/home/GroupsListSection";
import OrganizersSection from "./components/home/OrganizersSection";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Falling Snowflakes Animation */}
      <SnowEffect />

      {/* Main Home Sections */}
      <div className="relative z-10 space-y-12 pb-16">
        <HeroSection />
        <GroupsListSection />
        <OrganizersSection />
      </div>
    </div>
  );
}
