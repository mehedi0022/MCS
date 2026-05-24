import Link from "next/link"
import { Anchor } from "lucide-react"
import { FaqAccordion } from "@/components/faq/FaqAccordion"

export const metadata = {
  title: "FAQ | MCS",
  description:
    "Frequently asked questions about services, projects, training, and engagement with Marine Consultancy Services (MCS).",
}

const faqGroups = [
  {
    title: "General",
    items: [
      {
        q: "What does MCS specialize in?",
        a: "MCS specializes in hydrography, bathymetry, GIS, dredging support, environmental studies, coastal engineering, and project consultancy support.",
      },
      {
        q: "Where do you operate?",
        a: "Our core operations are in Bangladesh across inland waterways, coastal zones, ports, and marine infrastructure project locations.",
      },
    ],
  },
  {
    title: "Projects & Services",
    items: [
      {
        q: "Can MCS support both survey and consultancy in one project?",
        a: "Yes. We provide integrated support from field survey and data processing to analysis, modelling, reporting, and implementation guidance.",
      },
      {
        q: "Do you support dredging projects?",
        a: "Yes. We support pre- and post-dredging survey, monitoring, volume verification, and morphological analysis.",
      },
    ],
  },
  {
    title: "Training",
    items: [
      {
        q: "Who can join MCS training programs?",
        a: "Government agencies, project teams, consultants, operators, and technical professionals can join based on program scope.",
      },
      {
        q: "Can training be customized for our organization?",
        a: "Yes. We can design role-based training modules aligned with your tools, project needs, and timeline.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:border-primary/30 dark:bg-primary/10">
              <Anchor className="h-3 w-3" />
              Frequently Asked Questions
            </div>
            <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
              Common Questions <span className="text-primary">Answered Clearly</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-slate-500 dark:text-slate-400">
              Quick guidance on our services, project support, and training programs.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-8 px-6 pb-20 md:mt-12">
        <FaqAccordion groups={faqGroups} />

        <section className="mt-12 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Still Need Clarification?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Share your project context and our team will provide direct technical guidance.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  )
}
