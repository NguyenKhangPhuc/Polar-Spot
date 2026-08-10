import Image from "next/image";

interface GroupItem {
  id: string;
  name: string;
  members: string[];
  memberCount: number;
  shortDescription: string;
  category: string;
}

const groupsData: GroupItem[] = [
  {
    id: "g1",
    name: "Ice Breaker Tech",
    members: ["Alex Rivera", "Elena Vance", "Juho Mäkelä", "Sora Tanaka"],
    memberCount: 4,
    shortDescription: "Building next-generation extreme-cold thermal gear & smart wearables for arctic innovators.",
    category: "Hardware & Wearables",
  },
  {
    id: "g2",
    name: "Nordic Frost AI",
    members: ["Kasper Laine", "Aino Virtanen", "Lukas Weber"],
    memberCount: 3,
    shortDescription: "Autonomous climate data modeling, ice cap analytics, and real-time environmental prediction.",
    category: "AI & ClimateTech",
  },
  {
    id: "g3",
    name: "Glacier Energy",
    members: ["Matti Heikkinen", "Sofia Berg", "Tariq Mansour", "Laura Kivi", "Oliver Smith"],
    memberCount: 5,
    shortDescription: "Sub-zero renewable clean energy storage and efficient geothermal exchange systems.",
    category: "Clean Energy",
  },
  {
    id: "g4",
    name: "Polar Pitchers",
    members: ["Emmi Rantanen", "David Chen", "Hannu Salminen", "Maria Garcia"],
    memberCount: 4,
    shortDescription: "Global venture syndicate platform facilitating live pitch funding directly from ice-hole events.",
    category: "Fintech & Ventures",
  },
];

export default function GroupsListSection() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
            <span>🚀 Participating Teams</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Pitching <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Groups</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Meet the courageous startup teams taking the icy plunge to pitch their revolutionary ideas at Polar Bear Pitching.
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {groupsData.map((group) => (
            <div
              key={group.id}
              className="frost-card rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Group Image Placeholder */}
                <div className="relative w-full h-44 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex flex-col items-center justify-center overflow-hidden group-hover:border-cyan-400/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center text-2xl mb-2 text-cyan-300 group-hover:scale-110 transition-transform">
                    🧊
                  </div>
                  <span className="text-xs font-semibold text-cyan-200">
                    {group.name} Banner
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    [ Group Image Placeholder ]
                  </span>
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-400/30 text-[10px] font-medium text-cyan-300 backdrop-blur-md">
                    {group.category}
                  </span>
                </div>

                {/* Group Details */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {group.shortDescription}
                  </p>
                </div>
              </div>

              {/* Members Section */}
              <div className="mt-6 pt-4 border-t border-cyan-500/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Avatar stack placeholders */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {group.members.slice(0, 3).map((member, idx) => (
                      <div
                        key={idx}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white"
                        title={member}
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                    {group.memberCount > 3 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 ring-2 ring-slate-900 text-[10px] font-bold text-cyan-300">
                        +{group.memberCount - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {group.memberCount} Members
                  </span>
                </div>

                <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
