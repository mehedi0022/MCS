import Link from "next/link"
import { Anchor, CheckCircle2, Handshake } from "lucide-react"
import { Clients } from "@/components/home/Clients"

export const metadata = {
  title: "Clients & Sectors | MCS",
  description:
    "Sectors and client groups supported by Marine Consultancy Services (MCS) across Bangladesh.",
}

const sectors = [
  {
    title: "Government & Public Sector",
    body: "We support government agencies responsible for waterways, ports, coastal management, and infrastructure development.",
    points: [
      "Hydrographic and survey data for navigation and dredging",
      "Feasibility studies and project planning",
      "Environmental and morphological assessments",
      "Capacity development and technical training",
    ],
  },
  {
    title: "Ports & Maritime Sector",
    body: "Specialized technical support for ports, terminals, shipyards, and marine operators.",
    points: [
      "Channel surveys and navigability assessment",
      "Dredging monitoring and volume verification",
      "Coastal and port infrastructure support",
      "Hydrographic data for safe vessel operations",
    ],
  },
  {
    title: "Water Resources & Infrastructure",
    body: "Support for projects involving rivers, flood management, and coastal protection.",
    points: [
      "Hydrodynamic modelling and analysis",
      "Topographic and geospatial surveys",
      "River morphology and sediment studies",
      "Flood risk and hazard assessment",
    ],
  },
  {
    title: "Development Partners & Donor Projects",
    body: "Collaboration with international agencies and consultancy teams on development initiatives.",
    points: [
      "Technical surveys and data collection",
      "Environmental and social assessments",
      "Capacity building and training",
      "Monitoring and evaluation support",
    ],
  },
  {
    title: "Environmental & Research Sector",
    body: "Support for environmental sustainability and scientific research initiatives.",
    points: [
      "Environmental baseline studies",
      "Biodiversity and habitat mapping",
      "Oceanographic and climate data analysis",
      "GIS-based research support",
    ],
  },
]

export default function ClientsSectorsPage() {
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
              Clients & Sectors
            </div>
            <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
              Supporting Diverse{" "}
              <span className="text-primary">Waterway Stakeholders</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-slate-500 dark:text-slate-400">
              MCS supports public and private sector organizations with
              practical, technically sound solutions for Bangladesh&apos;s
              waterways.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sectors.map((item) => (
            <section
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/5"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.body}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <Clients />

      <div className="container mx-auto px-6">
        <section className="pb-20 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Looking for Sector-Specific Support?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Share your scope and timeline. We will recommend the right mix of
            survey, analysis, modelling, and consultancy support.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
            >
              Contact Us
            </Link>
            <Link
              href="/faq"
              className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 dark:border-white/20 dark:text-white"
            >
              View FAQ
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
