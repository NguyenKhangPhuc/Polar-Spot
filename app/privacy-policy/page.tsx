import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";

export const metadata: Metadata = {
  title: "Privacy Policy | Polar-Spot",
  description:
    "Learn how personal data is collected, processed, and protected on Polar-Spot in accordance with GDPR and Finnish privacy legislation.",
};

interface PolicySection {
  index: number;
  title: string;
  content: React.ReactNode;
}

const policySections: PolicySection[] = [
  {
    index: 1,
    title: "Data Controller",
    content: (
      <div className="space-y-2">
        <p>
          BusinessOulu (City of Oulu Public Enterprise) acts as the Data Controller for personal data processed within the Polar-Spot platform.
        </p>
        <div className="p-4 rounded-sm bg-[#151312] border border-white/5 font-mono text-xs text-[#b9cbc2] space-y-0.5">
          <p className="text-[#e8e1df] font-bold">BusinessOulu / BusinessAsema</p>
          <p>Visiting Address: Uusikatu 52, FI-90100 Oulu, Finland</p>
          <p>Postal Address: P.O. Box 22, FI-90015 Oulun kaupunki</p>
          <p>Email: info@businessoulu.com | Phone: +358 8 558 55810</p>
        </div>
      </div>
    ),
  },
  {
    index: 2,
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <p>
          To deliver event hosting, team presentation management, and jury scoring workflows, Polar-Spot collects and processes the following categories of data:
        </p>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Identity &amp; Account Information: </span>
              <span className="text-[#b9cbc2]">
                Name, email address, and role identifiers (Admin, Judge, Team Member, or Visitor) managed securely via Supabase Auth.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Team &amp; Event Content: </span>
              <span className="text-[#b9cbc2]">
                Team names, project descriptions, pitch deck links, presentation recordings, and member contact affiliations.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Evaluation &amp; Scoring Records: </span>
              <span className="text-[#b9cbc2]">
                Criteria ratings, evaluation notes, and computed scores submitted by designated judges during live or scheduled events.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Technical &amp; Operational Logs: </span>
              <span className="text-[#b9cbc2]">
                Session tokens, temporary authentication headers, and standard server diagnostic access logs maintained strictly for security monitoring and audit integrity.
              </span>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
  {
    index: 3,
    title: "Purpose of Processing & Data Confidentiality",
    content: (
      <div className="space-y-3">
        <p>
          Data is processed strictly to coordinate BusinessOulu events, manage team presentations, facilitate evaluation workflows, and keep event and team data visible for visitors and organizers.
        </p>
        <p className="text-[#e8e1df] font-semibold">
          Data Visibility, Feedback &amp; Score Confidentiality:
        </p>
        <p>
          Participating team profiles, project summaries, presentation materials, and constructive qualitative feedback from judges may be made visible to visitors and participants to foster community learning. In contrast, all numerical evaluation scores, criteria grades, individual judge ratings, and computed scoring results are strictly confidential, restricted exclusively to authorized judges and event administrators, and will not be published publicly.
        </p>
        <p className="text-[#00ffec] font-mono text-xs">
          Personal data is never sold, leased, or distributed to third-party commercial advertisers.
        </p>
      </div>
    ),
  },
  {
    index: 4,
    title: "Legal Basis (GDPR)",
    content: (
      <div className="space-y-3">
        <p>
          Under the EU General Data Protection Regulation (GDPR), we process personal data based on the following legal grounds:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Consent (Art. 6(1)(a) GDPR): </span>
              <span className="text-[#b9cbc2]">
                Given explicitly by users upon account creation, team registration, or submission of presentation content.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Legitimate Interest (Art. 6(1)(f) GDPR): </span>
              <span className="text-[#b9cbc2]">
                For system administration, user authentication, service reliability, and security log maintenance.
              </span>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
  {
    index: 5,
    title: "Self-Hosted Infrastructure & Data Sovereignty",
    content: (
      <div className="space-y-4">
        <p>
          Polar-Spot uses an independently self-hosted backend infrastructure deployed on a cloud service within the European Union, rather than using managed Supabase Cloud. This architecture ensures that BusinessOulu maintains complete sovereignty, full ownership, and direct operational control over all platform data without third-party vendor intervention:
        </p>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Self-Hosted Cloud Infrastructure: </span>
              <span className="text-[#b9cbc2]">
                Database and backend services are self-hosted on a cloud service within the European Union (EU), providing full data sovereignty with no third-party database vendor dependence.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Row Level Security (RLS): </span>
              <span className="text-[#b9cbc2]">
                PostgreSQL Row Level Security policies enforce strict isolation within the self-hosted database, preventing unauthorized cross-user data access.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffec] shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-[#e8e1df]">Encrypted Communication: </span>
              <span className="text-[#b9cbc2]">
                All data transmission between clients, web servers, and the self-hosted database utilizes end-to-end Transport Layer Security (TLS/SSL) encryption.
              </span>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
  {
    index: 6,
    title: "Your Rights Under GDPR",
    content: (
      <div className="space-y-3">
        <p>
          As a data subject under GDPR, you are entitled to exercise the following statutory rights:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-sm bg-[#151312] border border-white/5 space-y-1">
            <span className="text-xs font-bold text-[#e8e1df] block">Right of Access</span>
            <p className="text-xs text-[#b9cbc2]">Request a copy of personal data maintained about your profile.</p>
          </div>
          <div className="p-3.5 rounded-sm bg-[#151312] border border-white/5 space-y-1">
            <span className="text-xs font-bold text-[#e8e1df] block">Right to Rectification</span>
            <p className="text-xs text-[#b9cbc2]">Request correction of inaccurate or incomplete profile records.</p>
          </div>
          <div className="p-3.5 rounded-sm bg-[#151312] border border-white/5 space-y-1">
            <span className="text-xs font-bold text-[#e8e1df] block">Right to Erasure</span>
            <p className="text-xs text-[#b9cbc2]">Request deletion of your account and personal identifiers (&quot;Right to be Forgotten&quot;).</p>
          </div>
          <div className="p-3.5 rounded-sm bg-[#151312] border border-white/5 space-y-1">
            <span className="text-xs font-bold text-[#e8e1df] block">Right to Restriction</span>
            <p className="text-xs text-[#b9cbc2]">Object to or request restriction of specific processing actions.</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat py-24 px-6 md:px-16 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Top Back Navigation */}
        <div>
          <BackButton fallbackHref="/" label="BACK" className="mb-0" />
        </div>

        {/* Page Header Banner */}
        <div className="border-b border-white/5 pb-10">
          <div className="flex gap-4 items-stretch">
            <div className="w-[3px] bg-[#00ffec] shrink-0" />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-[#00ffec] tracking-[0.25em] uppercase font-bold">
                GDPR &amp; DATA PROTECTION // BUSINESSOULU
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-montserrat">
                Privacy Policy
              </h1>
              <p className="text-sm sm:text-base text-[#b9cbc2] max-w-2xl leading-relaxed opacity-90 font-sans pt-1">
                This Privacy Policy outlines how BusinessOulu collects, handles, and safeguards personal data processed within the Polar-Spot platform in accordance with the General Data Protection Regulation (GDPR).
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="flex flex-col gap-6">
          {policySections.map((section) => (
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
                07
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#e8e1df] font-montserrat uppercase tracking-wide">
                Privacy Inquiries &amp; GDPR Rights
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-[#b9cbc2] leading-relaxed font-sans opacity-90 pl-1 border-t border-white/5 pt-4 space-y-3">
              <p>
                To exercise your rights under GDPR or if you have questions regarding data privacy on Polar-Spot, please contact the controller:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="p-4 rounded-sm bg-[#151312] border border-white/5 space-y-1">
                  <span className="text-[9px] text-[#83958d] uppercase tracking-wider block">
                    Data Controller
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
                    Technical Support
                  </span>
                  <p className="font-bold text-[#e8e1df]">Phuc Nguyen</p>
                  <p className="text-[#b9cbc2]">Platform Architect</p>
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
            Polar-Spot // GDPR Compliance
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-and-conditions"
              className="text-[#00ffec] hover:underline uppercase tracking-wider"
            >
              Terms &amp; Conditions &rarr;
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
