import Image from "next/image";

interface Organizer {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  image: string;
}

const organizers: Organizer[] = [
  {
    id: "org-1",
    name: "Shefat Islam",
    role: "Head of Polar Bear Pitching",
    email: "shefat.islam@businessoulu.com",
    initials: "SI",
    image: "/teams/shefat.jpeg",
  },
  {
    id: "org-2",
    name: "Virpi Martikainen",
    role: "Head of Investor Relations",
    email: "virpi.martikainen@businessoulu.com",
    initials: "VM",
    image: "/teams/Virpi.jpeg",
  },
  {
    id: "org-3",
    name: "Anne Ryynänen",
    role: "Head of Startup Relations",
    email: "anne.r.ryynanen@businessoulu.com",
    initials: "AR",
    image: "/teams/anne.jpeg",
  },
  {
    id: "org-4",
    name: "Sari Kauppila",
    role: "Head of Day Conference",
    email: "sari.kauppila@businessoulu.com",
    initials: "SK",
    image: "/teams/1597916012941.jpeg",
  },
  {
    id: "org-5",
    name: "Marko Pyhähuhta",
    role: "Head of Media Relations",
    email: "marko.pyhahuhta@businessoulu.com",
    initials: "MP",
    image: "/teams/Marko.jpeg",
  },
];

export default function OrganizersSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Polar Bear Pitching <span className="text-sky-300">Organizers</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            The dedicated BusinessOulu team behind the world&apos;s coolest startup event.
          </p>
        </div>

        {/* Organizers Flex Grid (Centered Layout for incomplete rows) */}
        <div className="flex flex-wrap justify-center gap-8">
          {organizers.map((org) => (
            <div
              key={org.id}
              className="frost-card rounded-2xl p-6 border border-white/18 hover:border-white/45 transition-all duration-300 flex flex-col items-center text-center w-full sm:w-[340px] lg:w-[350px] shrink-0 group"
            >
              {/* 1. Large User Image */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#0a1526] border border-white/25 mb-6 group-hover:scale-105 group-hover:border-white/50 transition-all duration-300 shadow-xl shadow-black/50 overflow-hidden shrink-0">
                <Image
                  src={org.image}
                  alt={org.name}
                  fill
                  sizes="(max-width: 640px) 192px, 224px"
                  className="object-cover object-top hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* 2. Info Below Image: Name -> Email -> Role */}
              <div className="space-y-2 w-full flex flex-col items-center">
                {/* Name */}
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {org.name}
                </h3>

                {/* Email */}
                <a
                  href={`mailto:${org.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-sky-300 hover:text-white hover:underline transition-colors font-medium break-all"
                >
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{org.email}</span>
                </a>

                {/* Title / Role */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium pt-1">
                  {org.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
