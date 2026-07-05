import Link from "next/link"
import {
  Anchor,
  CheckCircle2,
  GraduationCap,
  Users,
  Briefcase,
  ArrowRight,
  Waves,
  Map,
  BarChart3,
} from "lucide-react"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"

const pageDescription =
  "Professional training programs in hydrography, GIS, morphology, and nautical charting by Marine Consultancy Services (MCS)."

export const metadata = createPageMetadata({
  title: "Training & Capacity Building",
  description: pageDescription,
  path: "/training",
  keywords: ["hydrography training", "GIS training", "ENC training", "capacity building"],
})

const trainingAreas = [
  "Hydrographic surveying and data processing",
  "GIS and spatial analysis",
  "River and coastal morphology",
  "ENC compilation and chart production",
  "Operation of survey equipment and software",
]

const structuredData = createJsonLdGraph([
  createWebPageSchema({
    path: "/training",
    name: "Training & Capacity Building",
    description: pageDescription,
    type: "WebPage",
  }),
  createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Training", path: "/training" },
  ]),
  {
    "@type": "ItemList",
    name: "MCS training areas",
    itemListElement: trainingAreas.map((area, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: area,
    })),
  },
])

const deliveryModes = [
  {
    title: "Professional Workshops",
    desc: "Structured sessions for technical staff and project teams.",
    icon: GraduationCap,
  },
  {
    title: "On-Project Coaching",
    desc: "Hands-on support during live survey and data workflows.",
    icon: Briefcase,
  },
  {
    title: "Institutional Capacity Programs",
    desc: "Longer-term training plans for agencies and organizations.",
    icon: Users,
  },
]

const outcomes = [
  "Improved technical confidence in survey and processing workflows",
  "Better project quality through consistent data standards",
  "Stronger institutional capability for long-term program delivery",
  "Faster decision-making through practical, applied training",
]

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      <section className="relative overflow-hidden pt-40 pb-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(20,184,166,0.16),transparent_45%),radial-gradient(circle_at_82%_18%,rgba(14,116,144,0.14),transparent_42%)] dark:bg-[radial-gradient(circle_at_18%_24%,rgba(45,212,191,0.2),transparent_45%),radial-gradient(circle_at_82%_18%,rgba(6,182,212,0.15),transparent_42%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:border-primary/30 dark:bg-primary/10">
                <Anchor className="h-3 w-3" />
                Training & Capacity Development
              </div>
              <h1 className="font-heading text-5xl leading-[1.05] font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
                Build Teams That Deliver
                <span className="block text-primary">
                  Accurate Waterway Data
                </span>
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
                Structured, field-driven training for hydrography, GIS,
                morphology, and nautical charting, designed for practical
                project execution across Bangladesh.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
                  Program Snapshot
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {[
                    { label: "Core Tracks", value: "05+" },
                    { label: "Delivery Modes", value: "03" },
                    { label: "Format", value: "Hands-On" },
                    { label: "Coverage", value: "Nationwide" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#020617]/70"
                    >
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.value}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-10 space-y-10 px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Training Areas
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {trainingAreas.map((item) => (
              <div
                key={item}
                className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all hover:border-primary/30 dark:border-white/10 dark:bg-[#020617]/60"
              >
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {deliveryModes.map((mode) => (
            <div
              key={mode.title}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary/30 dark:border-white/10 dark:bg-white/5"
            >
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/8 blur-2xl" />
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <mode.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {mode.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {mode.desc}
              </p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 lg:col-span-7 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Learning Path
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Foundation: concepts, standards, equipment orientation",
                "Applied Work: field data collection and processing workflows",
                "Implementation: reporting, QA checks, and decision support",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#020617]/60"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 lg:col-span-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Expected Outcomes
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {outcomes.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
            <div className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <h2 className="relative font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Need a Custom Training Plan?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              We design role-based programs for agencies, project teams, and
              technical units aligned with your timeline, tools, and outcomes.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                Request Training Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 dark:border-white/20 dark:text-white"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
