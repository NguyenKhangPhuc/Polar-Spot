import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";

export const metadata: Metadata = {
  title: "Terms & Conditions | Polar-Spot",
  description:
    "Review the Terms and Conditions for using Polar-Spot, the event management and team data visibility platform managed by BusinessOulu.",
};

interface TermSection {
  index: number;
  title: string;
  content: React.ReactNode;
}

const termsSections: TermSection[] = [
  {
    index: 1,
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using Polar-Spot, you agree to be bound by these Terms and Conditions. Polar-Spot is designed and managed by BusinessOulu, the official economic and business development agency of the City of Oulu, Finland. The platform architecture was developed by student software developer Phuc Nguyen from the University of Oulu in collaboration with BusinessOulu. If you do not agree to these terms, you may not access or use the platform.
      </p>
    ),
  },
  {
    index: 2,
    title: "Description of Service",
    content: (
      <p>
        Polar-Spot provides a digital event hosting and data management environment. The platform enables BusinessOulu to organize events, manage participating teams and pitch presentations, execute structured jury scoring workflows, and keep event and team data visible for visitors, judges, and event administrators.
      </p>
    ),
  },
  {
    index: 3,
    title: "User Registration & Account Security",
    content: (
      <div className="space-y-3">
        <p>
          Access to specific platform features (such as event administration, jury evaluation, or team management) requires authentication via credentials managed through Supabase Auth. Registered users are responsible for maintaining the confidentiality of their credentials and for all activities conducted under their account.
        </p>
        <p>
          BusinessOulu reserves the right to manage, suspend, or terminate user access if account information is compromised, misrepresentative, or violates platform operating guidelines.
        </p>
      </div>
    ),
  },
  {
    index: 4,
    title: "User Content & Public Visibility",
    content: (
      <div className="space-y-4">
        <p>
          Polar-Spot is specifically designed to keep team and event data visible for visitors and participants. By submitting profiles or materials, users acknowledge and agree that:
        </p>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Team and Project Profiles: </span>
              <span className="text-[#b9cbc2]">
                Team names, member rosters, project descriptions, and submitted pitch links are maintained on the platform to ensure transparency and public visibility for visitors.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Scores &amp; Feedback Policy: </span>
              <span className="text-[#b9cbc2]">
                Constructive feedback and qualitative commentary from judges may be made public to foster learning and engagement. In contrast, all numerical evaluation scores, individual judge ratings, criteria grades, and aggregated score calculations are strictly confidential and will not be published publicly.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Content Lawfulness: </span>
              <span className="text-[#b9cbc2]">
                Users warrant that all submitted media and information do not infringe third-party intellectual property rights, contain malicious code, or violate Finnish law.
              </span>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
  {
    index: 5,
    title: "Data Sovereignty & Self-Hosted Infrastructure",
    content: (
      <div className="space-y-3">
        <p>
          Polar-Spot operates on an independently self-hosted backend deployed on a cloud service rather than using managed Supabase Cloud. This self-hosted architecture ensures that BusinessOulu maintains complete sovereignty, full ownership, and direct operational control over all platform data without third-party vendor access.
        </p>
        <p>
          Personal data collection and processing on Polar-Spot is governed strictly in compliance with the General Data Protection Regulation (GDPR) and Finnish data protection legislation. For detailed information regarding data processing, storage, and your statutory rights, please review our{" "}
          <Link
            href="/privacy-policy"
            className="text-[#00ffec] hover:underline font-semibold"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    index: 6,
    title: "Third-Party Portals & Services",
    content: (
      <p>
        The platform may link to external websites and services, including BusinessOulu portals, municipal information sites, and external media hosts. BusinessOulu does not operate or endorse third-party services and assumes no responsibility for their content, policies, or technical operations.
      </p>
    ),
  },
  {
    index: 7,
    title: "Modifications to Platform & Terms",
    content: (
      <p>
        BusinessOulu reserves the right to modify, update, or temporarily suspend platform services or these Terms and Conditions at any time. Material updates will be reflected on this page with an updated timestamp. Continued use of Polar-Spot following updates constitutes acceptance of the amended terms.
      </p>
    ),
  },
  {
    index: 8,
    title: "Governing Law & Jurisdiction",
    content: (
      <p>
        These Terms and Conditions are governed by and construed under the laws of Finland. Any disputes arising from or relating to the use of Polar-Spot shall be subject to the exclusive jurisdiction of the competent courts of Finland.
      </p>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat py-24 px-6 md:px-16 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
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
                LEGAL PROTOCOL // BUSINESSOULU
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-montserrat">
                Terms &amp; Conditions
              </h1>
              <p className="text-sm sm:text-base text-[#b9cbc2] max-w-2xl leading-relaxed opacity-90 font-sans pt-1">
                These Terms and Conditions govern the access and use of Polar-Spot, the event management and team data visibility platform managed by BusinessOulu.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="flex flex-col gap-6">
          {termsSections.map((section) => (
            <section
              key={section.index}
              className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 sm:p-8 shadow-xl space-y-4 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00ffec] tabular-nums">
                  {String(section.index).padStart(2, "0")}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#e8e1df] font-montserrat uppercase tracking-wide">
                  {section.title}
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-[#b9cbc2] leading-relaxed font-sans opacity-90 pl-1 border-t border-white/5 pt-4">
                {section.content}
              </div>
            </section>
          ))}

          {/* Contact Section Card */}
          <section className="bg-[#1d1b1a] border border-[#00ffec]/30 rounded-sm p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00ffec] tabular-nums">
                09
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#e8e1df] font-montserrat uppercase tracking-wide">
                Contact &amp; Inquiries
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-[#b9cbc2] leading-relaxed font-sans opacity-90 pl-1 border-t border-white/5 pt-4 space-y-3">
              <p>
                If you have questions regarding these Terms and Conditions or the platform policies, please contact the managing team:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="p-4 rounded-sm bg-[#151312] border border-white/5 space-y-1">
                  <span className="text-[9px] text-[#83958d] uppercase tracking-wider block">
                    Managing Organizer
                  </span>
                  <p className="font-bold text-[#e8e1df]">BusinessOulu</p>
                  <p className="text-[#b9cbc2]">BusinessAsema, Uusikatu 52</p>
                  <p className="text-[#b9cbc2]">FI-90100 Oulu, Finland</p>
                  <a
                    href="mailto:info@businessoulu.com"
                    className="text-[#00ffec] hover:underline block pt-1"
                  >
                    info@businessoulu.com
                  </a>
                </div>

                <div className="p-4 rounded-sm bg-[#151312] border border-white/5 space-y-1">
                  <span className="text-[9px] text-[#83958d] uppercase tracking-wider block">
                    Platform Developer
                  </span>
                  <p className="font-bold text-[#e8e1df]">Phuc Nguyen</p>
                  <p className="text-[#b9cbc2]">Main Developer</p>
                  <p className="text-[#b9cbc2]">University of Oulu</p>
                  <a
                    href="mailto:Phuc.Nguyen@student.oulu.fi"
                    className="text-[#00ffec] hover:underline block pt-1"
                  >
                    Phuc.Nguyen@student.oulu.fi
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Cross-links Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs font-mono">
          <span className="text-[#83958d] uppercase tracking-wider">
            Polar-Spot // BusinessOulu Event Platform
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-[#00ffec] hover:underline uppercase tracking-wider"
            >
              Privacy Policy &rarr;
            </Link>
            <Link
              href="/about"
              className="text-[#b9cbc2] hover:text-[#00ffec] uppercase tracking-wider"
            >
              About Platform &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
