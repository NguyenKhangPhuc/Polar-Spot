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
    <section className="w-full py-24 px-6 md:px-16 bg-[#100e0d] border-y border-[#3a4a44]/50 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-[linear-gradient(to_right,rgba(0,255,236,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,236,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <p className="text-[#00ffec] font-semibold text-xs uppercase tracking-[0.4em] font-mono">
            Core_Operators
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e8e1df] font-montserrat">
            Polar Bear Pitching <span className="text-[#00ffec]">Organizers</span>
          </h2>
          <div className="w-12 h-0.5 bg-[#00ffec] mx-auto my-4"></div>
          <p className="text-sm sm:text-base text-[#b9cbc2] max-w-xl mx-auto opacity-70 leading-relaxed font-medium">
            The dedicated BusinessOulu team behind the world&apos;s coolest startup event.
          </p>
        </div>

        {/* Organizers Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {organizers.map((org) => (
            <div
              key={org.id}
              className="bg-[#1d1b1a] rounded-sm p-6 border border-[#3a4a44]/50 hover:border-[#00ffec]/50 transition-all duration-300 flex flex-col items-center text-center w-full sm:w-[340px] lg:w-[350px] shrink-0 group shadow-xl"
            >
              {/* Clean Image Container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-sm bg-[#141211] border border-[#3a4a44]/50 mb-6 group-hover:scale-105 transition-all duration-300 shadow-xl overflow-hidden shrink-0 p-1">
                <Image
                  src={org.image}
                  alt={org.name}
                  fill
                  sizes="(max-width: 640px) 192px, 224px"
                  className="object-cover object-top rounded-sm hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 border-2 border-[#00ffec]/0 group-hover:border-[#00ffec]/60 transition-all duration-500 pointer-events-none"></div>
              </div>

              {/* Info Below Image */}
              <div className="space-y-2 w-full flex flex-col items-center">
                <h3 className="text-xl sm:text-2xl font-bold text-[#e8e1df] group-hover:text-[#00ffec] transition-colors font-montserrat">
                  {org.name}
                </h3>

                <a
                  href={`mailto:${org.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#00ffec] hover:text-[#e8e1df] hover:underline transition-colors font-mono break-all"
                >
                  <svg className="w-3.5 h-3.5 text-[#00ffec] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{org.email}</span>
                </a>

                <p className="text-xs sm:text-sm text-[#83958d] font-mono uppercase tracking-widest pt-1">
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
