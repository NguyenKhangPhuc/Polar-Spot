import Image from "next/image";

interface Organizer {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
}

const organizers: Organizer[] = [
  {
    id: "org-1",
    name: "Shefat Islam",
    role: "Head of Polar Bear Pitching",
    email: "shefat.islam@businessoulu.com",
    initials: "SI",
  },
  {
    id: "org-2",
    name: "Virpi Martikainen",
    role: "Head of Investor Relations",
    email: "virpi.martikainen@businessoulu.com",
    initials: "VM",
  },
  {
    id: "org-3",
    name: "Anne Ryynänen",
    role: "Head of Startup Relations",
    email: "anne.r.ryynanen@businessoulu.com",
    initials: "AR",
  },
  {
    id: "org-4",
    name: "Sari Kauppila",
    role: "Head of Day Conference",
    email: "sari.kauppila@businessoulu.com",
    initials: "SK",
  },
  {
    id: "org-5",
    name: "Marko Pyhähuhta",
    role: "Head of Media Relations",
    email: "marko.pyhahuhta@businessoulu.com",
    initials: "MP",
  },
];

export default function OrganizersSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
            <span>👥 Leadership Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Polar Bear Pitching <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Organizers</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            The dedicated BusinessOulu team behind the world&apos;s coolest startup event.
          </p>
        </div>

        {/* Organizers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizers.map((org) => (
            <div
              key={org.id}
              className="frost-card rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 flex flex-col items-center text-center group"
            >
              {/* Image / Avatar Placeholder */}
              <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-cyan-950 border border-cyan-400/30 flex flex-col items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-950/50">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 text-lg font-bold">
                  {org.initials}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">
                  [ Photo Placeholder ]
                </span>
              </div>

              {/* Name & Title */}
              <div className="space-y-1 w-full">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {org.name}
                </h3>
                <p className="text-xs font-semibold text-cyan-400">
                  {org.role}
                </p>
              </div>

              {/* Email Contact Link */}
              <div className="mt-4 pt-4 border-t border-cyan-500/15 w-full flex items-center justify-center">
                <a
                  href={`mailto:${org.email}`}
                  className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-300 hover:underline transition-colors break-all"
                >
                  <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{org.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
