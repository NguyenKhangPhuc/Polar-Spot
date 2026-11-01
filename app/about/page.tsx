import type { Metadata } from "next";
import Image from "next/image";
import BackButton from "@/app/components/BackButton";

export const metadata: Metadata = {
  title: "About Polar-Spot | BusinessOulu Event Platform",
  description:
    "Learn about Polar-Spot, the event platform designed for BusinessOulu to manage and keep event and team data visible for visitors.",
};

const keyOrganizers = [
  {
    name: "Shefat Islam",
    role: "Head of Polar Bear Pitching",
    email: "shefat.islam@businessoulu.com",
    image: "/teams/shefat.jpeg",
  },
  {
    name: "Virpi Martikainen",
    role: "Head of Investor Relations",
    email: "virpi.martikainen@businessoulu.com",
    image: "/teams/Virpi.jpeg",
  },
  {
    name: "Anne Ryynänen",
    role: "Head of Startup Relations",
    email: "anne.r.ryynanen@businessoulu.com",
    image: "/teams/anne.jpeg",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat py-24 px-6 md:px-16 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Top Back Navigation */}
        <div>
          <BackButton href="/" label="BACK TO HOME" className="mb-0" />
        </div>

        {/* Page Header Banner */}
        <div className="border-b border-white/5 pb-10">
          <div className="flex gap-4 items-stretch">
            <div className="w-[3px] bg-[#00ffec] shrink-0" />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-[#00ffec] tracking-[0.25em] uppercase font-bold">
                PLATFORM OVERVIEW // BUSINESSOULU
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-montserrat">
                About Polar-Spot
              </h1>
              <p className="text-sm sm:text-base text-[#b9cbc2] max-w-3xl leading-relaxed opacity-90 font-sans pt-1">
                Polar-Spot is an event platform designed for BusinessOulu to host events, manage team presentations, and keep event and team data visible for visitors and participants.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Platform Purpose */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffec]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffec]">
              01 // PLATFORM PURPOSE
            </span>
          </div>

          <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-10 shadow-xl space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#e8e1df] font-montserrat">
              Managing and Keeping Event Data Visible for Visitors
            </h2>
            <p className="text-sm sm:text-base text-[#b9cbc2] leading-relaxed font-sans opacity-90">
              Polar-Spot is designed for BusinessOulu to host and manage its events in one centralized location. The platform provides a clear, reliable system for managing and keeping the data of participating teams and events visible for visitors, judges, and event organizers.
            </p>

            {/* 3 Purpose Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-[#151312] border border-white/5 p-6 rounded-sm flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-[#00ffec] tracking-wider uppercase">
                  Event Hosting
                </span>
                <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans opacity-80">
                  Enables BusinessOulu to host and organize events smoothly, keeping schedules, sessions, and guidelines structured and accessible.
                </p>
              </div>

              <div className="bg-[#151312] border border-white/5 p-6 rounded-sm flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-[#00ffec] tracking-wider uppercase">
                  Team Data Visibility
                </span>
                <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans opacity-80">
                  Keeps participating team profiles, project information, and presentation materials organized and visible for visitors and evaluators.
                </p>
              </div>

              <div className="bg-[#151312] border border-white/5 p-6 rounded-sm flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-[#00ffec] tracking-wider uppercase">
                  Transparent Evaluation
                </span>
                <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans opacity-80">
                  Provides a structured scoring workflow allowing judges to submit transparent criteria grades and display final rankings clearly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Managing Organization — BusinessOulu */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffec]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffec]">
              02 // MANAGING ORGANIZER
            </span>
          </div>

          <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-10 shadow-xl space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
                  City of Oulu Public Enterprise
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#e8e1df] font-montserrat">
                  BusinessOulu
                </h2>
                <p className="text-sm text-[#b9cbc2] leading-relaxed font-sans opacity-90 pt-1">
                  BusinessOulu is the official economic and business development agency of the City of Oulu, Finland. As the main manager of Polar-Spot, BusinessOulu oversees event curation, team participation, and public visibility across regional business initiatives.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.businessoulu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-sm bg-[#00ffec] hover:brightness-110 text-[#00382b] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#00ffec]/20 flex items-center justify-center gap-2"
                >
                  <span>VISIT BUSINESSOULU.COM</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 rounded-sm bg-[#151312] border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider font-bold block">
                  ROLE ON POLAR-SPOT
                </span>
                <h3 className="text-base font-bold text-[#e8e1df]">Platform Manager</h3>
                <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans opacity-80">
                  BusinessOulu is the primary manager of the platform, organizing events, coordinating participating teams, and publishing event results.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#151312] border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider font-bold block">
                  REGIONAL MISSION
                </span>
                <h3 className="text-base font-bold text-[#e8e1df]">Enterprise Vitality</h3>
                <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans opacity-80">
                  Fostering economic growth, supporting startups and local companies, and building dynamic business networks in the Oulu region.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#151312] border border-white/5 space-y-2 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider font-bold block">
                  ANNUAL EVENT
                </span>
                <h3 className="text-base font-bold text-[#e8e1df]">Polar Bear Pitching</h3>
                <p className="text-xs text-[#b9cbc2] leading-relaxed font-sans opacity-80">
                  Organizing premier startup and investor events, including the internationally recognized pitching competition in Oulu.
                </p>
              </div>
            </div>

            {/* Core Event Leadership Team */}
            <div className="space-y-4 pt-4">
              <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-widest font-bold block">
                BUSINESS OULU EVENT TEAM
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyOrganizers.map((org) => (
                  <div
                    key={org.name}
                    className="p-4 rounded-sm bg-[#151312] border border-white/5 flex items-center gap-4 hover:border-[#00ffec]/40 transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-sm bg-[#100e0d] border border-white/10 shrink-0 overflow-hidden">
                      <Image
                        src={org.image}
                        alt={org.name}
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-[#e8e1df] truncate">
                        {org.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider truncate">
                        {org.role}
                      </span>
                      <a
                        href={`mailto:${org.email}`}
                        className="text-[11px] font-mono text-[#00ffec] hover:underline truncate mt-0.5"
                      >
                        {org.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Platform Developer — Phuc Nguyen */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffec]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffec]">
              03 // PLATFORM DEVELOPER
            </span>
          </div>

          <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#00ffec] uppercase tracking-wider font-bold block">
                  Main Developer
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#e8e1df] font-montserrat">
                  Phuc Nguyen
                </h2>
              </div>
              <a
                href="mailto:Phuc.Nguyen@student.oulu.fi"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#00ffec] hover:underline"
              >
                <svg className="w-3.5 h-3.5 text-[#00ffec] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Phuc.Nguyen@student.oulu.fi</span>
              </a>
            </div>

            <p className="text-sm sm:text-base text-[#b9cbc2] leading-relaxed font-sans opacity-90">
              Phuc Nguyen is a Computer Sciences and Engineering student at the University of Oulu who architected the platform. Professionals in Web developments, full-stack application architecture, cloud solutions, and UI/UX design, building intuitive systems for events / data management.
            </p>
          </div>
        </section>

        {/* Section 4: Contact Information */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ffec]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ffec]">
              04 // CONTACT &amp; LOCATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Card 1: Headquarters */}
            <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00ffec] uppercase tracking-wider font-bold">
                    LOCATION
                  </span>
                  <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                    FINLAND
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#e8e1df]">BusinessAsema</h3>
                <div className="text-xs text-[#b9cbc2] space-y-1 font-sans leading-relaxed">
                  <p className="font-semibold text-[#e8e1df]">Visiting Address:</p>
                  <p>Uusikatu 52</p>
                  <p>FI-90100 Oulu, Finland</p>
                  <p className="pt-2 font-semibold text-[#e8e1df]">Postal Address:</p>
                  <p>P.O. Box 22, FI-90015 Oulun kaupunki</p>
                </div>
              </div>
            </div>

            {/* Contact Card 2: Channels */}
            <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00ffec] uppercase tracking-wider font-bold">
                    COMMUNICATION
                  </span>
                  <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                    DIRECT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#e8e1df]">General Inquiries</h3>
                <div className="text-xs text-[#b9cbc2] space-y-2 font-mono">
                  <div>
                    <span className="block text-[9px] text-[#83958d] uppercase tracking-widest">EMAIL:</span>
                    <a href="mailto:info@businessoulu.com" className="text-[#00ffec] hover:underline">
                      info@businessoulu.com
                    </a>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#83958d] uppercase tracking-widest">BUSINESS SERVICES:</span>
                    <a href="mailto:elinkeinopalvelut@businessoulu.com" className="text-[#00ffec] hover:underline">
                      elinkeinopalvelut@businessoulu.com
                    </a>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#83958d] uppercase tracking-widest">TELEPHONE:</span>
                    <span className="text-[#e8e1df]">+358 8 558 55810</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card 3: Portals */}
            <div className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00ffec] uppercase tracking-wider font-bold">
                    RESOURCES
                  </span>
                  <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
                    EXTERNAL
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#e8e1df]">Official Portals</h3>
                <div className="flex flex-col gap-3 pt-1">
                  <a
                    href="https://www.businessoulu.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-sm bg-[#151312] border border-white/5 hover:border-[#00ffec]/40 text-xs font-mono text-[#e8e1df] hover:text-[#00ffec] transition-colors flex items-center justify-between"
                  >
                    <span>BusinessOulu Portal</span>
                    <svg className="w-3.5 h-3.5 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://polarbearpitching.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-sm bg-[#151312] border border-white/5 hover:border-[#00ffec]/40 text-xs font-mono text-[#e8e1df] hover:text-[#00ffec] transition-colors flex items-center justify-between"
                  >
                    <span>Polar Bear Pitching</span>
                    <svg className="w-3.5 h-3.5 text-[#00ffec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
