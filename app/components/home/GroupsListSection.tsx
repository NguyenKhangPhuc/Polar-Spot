interface GroupItem {
  id: string;
  name: string;
  members: string[];
  memberCount: number;
  shortDescription: string;
  category: string;
  colSpan: string; // Asymmetric width col-span for desktop layout
}

const groupsData: GroupItem[] = [
  {
    id: "g1",
    name: "Ice Breaker Tech",
    members: ["Alex Rivera", "Elena Vance", "Juho Mäkelä", "Sora Tanaka"],
    memberCount: 4,
    shortDescription: "Building next-generation extreme-cold thermal gear & smart wearables for arctic innovators.",
    category: "Hardware & Wearables",
    colSpan: "lg:col-span-7",
  },
  {
    id: "g2",
    name: "Nordic Frost AI",
    members: ["Kasper Laine", "Aino Virtanen", "Lukas Weber"],
    memberCount: 3,
    shortDescription: "Autonomous climate data modeling, ice cap analytics, and real-time environmental prediction.",
    category: "AI & ClimateTech",
    colSpan: "lg:col-span-5",
  },
  {
    id: "g3",
    name: "Glacier Energy",
    members: ["Matti Heikkinen", "Sofia Berg", "Tariq Mansour", "Laura Kivi", "Oliver Smith"],
    memberCount: 5,
    shortDescription: "Sub-zero renewable clean energy storage and efficient geothermal exchange systems.",
    category: "Clean Energy",
    colSpan: "lg:col-span-5",
  },
  {
    id: "g4",
    name: "Polar Pitchers",
    members: ["Emmi Rantanen", "David Chen", "Hannu Salminen", "Maria Garcia"],
    memberCount: 4,
    shortDescription: "Global venture syndicate platform facilitating live pitch funding directly from ice-hole events.",
    category: "Fintech & Ventures",
    colSpan: "lg:col-span-7",
  },
];

export default function GroupsListSection() {
  return (
    <section className="w-full py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <p className="text-[#00ffec] font-semibold text-xs uppercase tracking-[0.4em] font-mono">
            Startup_Ecosystem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e8e1df] font-montserrat">
            Pitching <span className="text-[#00ffec]">Groups</span>
          </h2>
          <div className="w-12 h-0.5 bg-[#00ffec] mx-auto my-4"></div>
          <p className="text-sm sm:text-base text-[#b9cbc2] max-w-xl mx-auto opacity-70 leading-relaxed font-medium">
            Meet the courageous startup teams taking the icy plunge to pitch their revolutionary ideas at Polar Bear Pitching.
          </p>
        </div>

        {/* Asymmetric Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {groupsData.map((group) => (
            <div
              key={group.id}
              className={`bg-[#1d1b1a] rounded-sm p-6 sm:p-8 border border-[#3a4a44]/50 hover:border-[#00ffec]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl ${group.colSpan}`}
            >
              <div className="space-y-5">
                {/* 1-Layer Image Placeholder */}
                <div className="relative w-full h-44 rounded-sm bg-[#141211] border border-[#3a4a44]/60 flex flex-col items-center justify-center overflow-hidden group-hover:border-[#00ffec]/40 transition-colors">
                  <div className="w-10 h-10 rounded-sm bg-[#252220] border border-[#3a4a44] flex items-center justify-center mb-2 text-[#e8e1df] group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#e8e1df]">
                    {group.name} Banner
                  </span>
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-sm bg-[#100e0d] border border-[#3a4a44] text-[10px] font-mono tracking-widest uppercase text-[#00ffec]">
                    {group.category}
                  </span>
                </div>

                {/* Group Details */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#e8e1df] group-hover:text-[#00ffec] transition-colors font-montserrat">
                    {group.name}
                  </h3>
                  <p className="text-sm text-[#b9cbc2] leading-relaxed opacity-80 font-normal">
                    {group.shortDescription}
                  </p>
                </div>
              </div>

              {/* Members Section */}
              <div className="mt-6 pt-4 border-t border-[#3a4a44]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {group.members.slice(0, 3).map((member, idx) => (
                      <div
                        key={idx}
                        className="inline-block h-7 w-7 rounded-sm ring-2 ring-[#151312] bg-[#252220] border border-[#3a4a44] flex items-center justify-center text-[10px] font-bold text-[#e8e1df]"
                        title={member}
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                    {group.memberCount > 3 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#100e0d] ring-2 ring-[#151312] border border-[#3a4a44] text-[10px] font-bold text-[#00ffec]">
                        +{group.memberCount - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[#83958d] font-mono">
                    {group.memberCount} Members
                  </span>
                </div>

                <button className="text-xs font-bold uppercase tracking-wider text-[#e8e1df] hover:text-[#00ffec] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer font-mono">
                  <span>View Details</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
