import Image from "next/image";

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
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Pitching <span className="text-sky-200">Groups</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Meet the courageous startup teams taking the icy plunge to pitch their revolutionary ideas at Polar Bear Pitching.
          </p>
        </div>

        {/* Asymmetric Groups Grid (12-column grid with non-uniform card widths) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {groupsData.map((group) => (
            <div
              key={group.id}
              className={`frost-card rounded-2xl p-6 border border-white/15 hover:border-white/45 transition-all duration-300 flex flex-col justify-between group ${group.colSpan}`}
            >
              <div className="space-y-4">
                {/* Group Image Placeholder */}
                <div className="relative w-full h-48 rounded-xl bg-slate-900/90 border border-white/20 flex flex-col items-center justify-center overflow-hidden group-hover:border-white/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/30 flex items-center justify-center mb-2 text-white group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {group.name} Banner
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    [ Group Image Placeholder ]
                  </span>
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/25 text-[10px] font-medium text-sky-200 backdrop-blur-md">
                    {group.category}
                  </span>
                </div>

                {/* Group Details */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-sky-200 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {group.shortDescription}
                  </p>
                </div>
              </div>

              {/* Members Section */}
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Avatar stack placeholders */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {group.members.slice(0, 3).map((member, idx) => (
                      <div
                        key={idx}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-slate-700 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white"
                        title={member}
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                    {group.memberCount > 3 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 ring-2 ring-slate-900 border border-white/20 text-[10px] font-bold text-sky-200">
                        +{group.memberCount - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-300 font-medium">
                    {group.memberCount} Members
                  </span>
                </div>

                <button className="text-xs font-semibold text-white hover:text-sky-200 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
