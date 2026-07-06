import { Anchor } from "lucide-react"
import { FaqAccordion } from "@/components/faq/FaqAccordion"
import { API_URL } from "@/lib/api"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  absoluteUrl,
  cleanText,
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"

const pageDescription =
  "Frequently asked questions about services, projects, training, and engagement with Marine Consultancy Services (MCS)."

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions",
  description: pageDescription,
  path: "/faq",
  keywords: [
    "MCS FAQ",
    "marine consultancy questions",
    "hydrographic survey FAQ",
  ],
})

type FaqRow = {
  id: string
  category: string
  question: string
  answer: string
  sortOrder?: number
}

type FaqGroup = {
  title: string
  items: Array<{
    q: string
    a: string
  }>
}

const fallbackFaqGroups: FaqGroup[] = [
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

function groupFaqRows(rows: FaqRow[]): FaqGroup[] {
  const groups = new Map<string, FaqGroup>()

  rows.forEach((row) => {
    const title = row.category?.trim() || "General"
    const question = row.question?.trim()
    const answer = row.answer?.trim()

    if (!question || !answer) {
      return
    }

    if (!groups.has(title)) {
      groups.set(title, { title, items: [] })
    }

    groups.get(title)?.items.push({ q: question, a: answer })
  })

  return Array.from(groups.values()).filter((group) => group.items.length > 0)
}

async function getFaqGroups(): Promise<FaqGroup[]> {
  try {
    const response = await fetch(`${API_URL}/faqs`, { cache: "no-store" })

    if (!response.ok) {
      return fallbackFaqGroups
    }

    const payload = await response.json()
    const rows = (payload.data ?? []) as FaqRow[]
    const groups = groupFaqRows(rows)

    return groups.length > 0 ? groups : fallbackFaqGroups
  } catch {
    return fallbackFaqGroups
  }
}

export default async function FaqPage() {
  const faqGroups = await getFaqGroups()
  const questions = faqGroups.flatMap((group) => group.items)
  const structuredData = createJsonLdGraph([
    createWebPageSchema({
      path: "/faq",
      name: "Frequently Asked Questions",
      description: pageDescription,
      type: "WebPage",
    }),
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/faq" },
    ]),
    {
      "@type": "FAQPage",
      "@id": `${absoluteUrl("/faq")}#faq`,
      mainEntity: questions.map((item) => ({
        "@type": "Question",
        name: cleanText(item.q),
        acceptedAnswer: {
          "@type": "Answer",
          text: cleanText(item.a),
        },
      })),
    },
  ])

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      <section className="relative overflow-hidden pt-26 pb-10 md:pt-32 md:pb-15">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[8px] font-bold tracking-[0.2em] text-primary uppercase md:text-[10px] dark:border-primary/30 dark:bg-primary/10">
              <Anchor className="h-3 w-3" />
              Frequently Asked Questions
            </div>
            <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
              Common Questions{" "}
              <span className="text-primary">Answered Clearly</span>
            </h1>
            <p className="mt-8 text-base leading-relaxed text-slate-500 md:text-xl dark:text-slate-400">
              Quick guidance on our services, project support, and training
              programs.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-8 px-6 pb-20 md:mt-12">
        <FaqAccordion groups={faqGroups} />
      </div>
    </main>
  )
}
