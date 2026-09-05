import SnowEffect from "./components/home/SnowEffect";
import HeroSection from "./components/home/HeroSection";
import GroupsListSection from "./components/home/GroupsListSection";
import OrganizersSection from "./components/home/OrganizersSection";

export default function Home() {
  return (
    <div className="w-full bg-[#151312] text-[#e8e1df] font-montserrat overflow-x-hidden relative min-h-screen">
      {/* Background Falling Snowflakes Animation */}
      <SnowEffect />

      {/* Main Home Sections */}
      <div className="relative z-10">
        <HeroSection />
        <GroupsListSection />
        <OrganizersSection />
      </div>
    </div>
  );
}
