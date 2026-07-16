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
  Wrench,
} from "lucide-react"
import { icons } from "lucide-react"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"
import { API_URL, type ApiResponse } from "@/lib/api"

const pageDescription =
  "Professional training programs in hydrography, GIS, morphology, and nautical charting by Marine Consultancy Services (MCS)."

export const metadata = createPageMetadata({
  title: "Training & Capacity Building",
  description: pageDescription,
  path: "/training",
  keywords: [
    "hydrography training",
    "GIS training",
    "ENC training",
    "capacity building",
  ],
})

const fallbackTrainingAreas = [
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
    itemListElement: fallbackTrainingAreas.map((area, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: area,
    })),
  },
])

const fallbackDeliveryModes = [
  {
    title: "Professional Workshops",
    description: "Structured sessions for technical staff and project teams.",
    icon: GraduationCap,
  },
  {
    title: "On-Project Coaching",
    description: "Hands-on support during live survey and data workflows.",
    icon: Briefcase,
  },
  {
    title: "Institutional Capacity Programs",
    description: "Longer-term training plans for agencies and organizations.",
    icon: Users,
  },
]

const fallbackOutcomes = [
  "Improved technical confidence in survey and processing workflows",
  "Better project quality through consistent data standards",
  "Stronger institutional capability for long-term program delivery",
  "Faster decision-making through practical, applied training",
]

const fallbackLearningSteps = [
  "Foundation: concepts, standards, equipment orientation",
  "Applied Work: field data collection and processing workflows",
  "Implementation: reporting, QA checks, and decision support",
]

const fallbackStats = [
  { label: "Core Tracks", value: "05+" },
  { label: "Delivery Modes", value: "03" },
  { label: "Format", value: "Hands-On" },
  { label: "Coverage", value: "Nationwide" },
]

type TrainingItem = {
  id: string
  section: "AREA" | "MODE" | "STEP" | "OUTCOME" | "STAT"
  title: string
  description?: string | null
  iconKey?: string | null
  value?: string | null
  sortOrder: number
  isActive: boolean
}

type TrainingPageContent = {
  heroBadge: string
  heroTitleLine1: string
  heroTitleHighlight: string
  heroDescription: string
  snapshotEyebrow: string
  learningPathTitle: string
  outcomesTitle: string
  ctaTitle: string
  ctaDescription: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

type TrainingResponse = {
  page: TrainingPageContent
  items: TrainingItem[]
}

const fallbackPage: TrainingPageContent = {
  heroBadge: "Training & Capacity Development",
  heroTitleLine1: "Build Teams That Deliver",
  heroTitleHighlight: "Accurate Waterway Data",
  heroDescription:
    "Structured, field-driven training for hydrography, GIS, morphology, and nautical charting, designed for practical project execution across Bangladesh.",
  snapshotEyebrow: "Program Snapshot",
  learningPathTitle: "Learning Path",
  outcomesTitle: "Expected Outcomes",
  ctaTitle: "Need a Custom Training Plan?",
  ctaDescription:
    "We design role-based programs for agencies, project teams, and technical units aligned with your timeline, tools, and outcomes.",
  primaryButtonText: "Request Training Plan",
  primaryButtonLink: "/contact",
  secondaryButtonText: "View FAQ",
  secondaryButtonLink: "/faq",
}

function resolveIcon(iconKey?: string | null) {
  return (
    (iconKey
      ? (icons[iconKey as keyof typeof icons] as typeof GraduationCap | undefined)
      : undefined) ?? Wrench
  )
}

async function getTrainingContent(): Promise<TrainingResponse> {
  try {
    const response = await fetch(`${API_URL}/training`, { cache: "no-store" })
    if (!response.ok) {
      throw new Error("Failed to load training content")
    }
    const payload = (await response.json()) as ApiResponse<TrainingResponse>
    return payload.data
  } catch {
    return { page: fallbackPage, items: [] }
  }
}

export default async function TrainingPage() {
  const content = await getTrainingContent()
  const page = content.page ?? fallbackPage
  const items = content.items ?? []

  const trainingAreas =
    items.filter((item) => item.section === "AREA").map((item) => item.title) ||
    []
  const deliveryModes = items
    .filter((item) => item.section === "MODE")
    .map((item) => ({
      title: item.title,
      description: item.description ?? "",
      icon: resolveIcon(item.iconKey),
    }))
  const learningSteps = items
    .filter((item) => item.section === "STEP")
    .map((item) => item.title)
  const outcomes = items
    .filter((item) => item.section === "OUTCOME")
    .map((item) => item.title)
  const stats = items
    .filter((item) => item.section === "STAT")
    .map((item) => ({
      label: item.title,
      value: item.value ?? item.description ?? "",
    }))

  const displayAreas = trainingAreas.length > 0 ? trainingAreas : fallbackTrainingAreas
  const displayModes = deliveryModes.length > 0 ? deliveryModes : fallbackDeliveryModes
  const displaySteps = learningSteps.length > 0 ? learningSteps : fallbackLearningSteps
  const displayOutcomes = outcomes.length > 0 ? outcomes : fallbackOutcomes
  const displayStats = stats.length > 0 ? stats : fallbackStats

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />

      <section className="relative overflow-hidden pt-26 pb-10 md:pt-32 md:pb-15">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[8px] font-bold tracking-[0.2em] text-primary uppercase md:text-[10px] dark:border-primary/30 dark:bg-primary/10">
                <Anchor className="h-3 w-3" />
                {page.heroBadge}
              </div>
              <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
                {page.heroTitleLine1}{" "}
                <span className="text-primary">{page.heroTitleHighlight}</span>
              </h1>
              <p className="mt-8 text-base leading-relaxed text-slate-500 md:text-xl dark:text-slate-400">
                {page.heroDescription}
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
                  {page.snapshotEyebrow}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {displayStats.map((item) => (
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
            {displayAreas.map((item) => (
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
          {displayModes.map((mode) => (
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
                {mode.description}
              </p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 lg:col-span-7 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {page.learningPathTitle}
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {displaySteps.map((step, index) => (
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
                {page.outcomesTitle}
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {displayOutcomes.map((point) => (
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
              {page.ctaTitle}
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              {page.ctaDescription}
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={page.primaryButtonLink}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                {page.primaryButtonText}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={page.secondaryButtonLink}
                className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 dark:border-white/20 dark:text-white"
              >
                {page.secondaryButtonText}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
