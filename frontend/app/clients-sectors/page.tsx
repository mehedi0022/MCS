import Link from "next/link"
import { Anchor, CheckCircle2 } from "lucide-react"
import { Clients } from "@/components/home/Clients"
import { API_URL } from "@/lib/api"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  absoluteUrl,
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"

const pageDescription =
  "Sectors and client groups supported by Marine Consultancy Services (MCS) across Bangladesh."

export const metadata = createPageMetadata({
  title: "Clients & Sectors",
  description: pageDescription,
  path: "/clients-sectors",
  keywords: ["MCS clients", "ports maritime sector", "waterway stakeholders"],
})

type SectorItem = {
  id: string
  title: string
  body: string
  points?: string[] | null
}

const fallbackSectors: SectorItem[] = [
  {
    id: "government-public-sector",
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
    id: "ports-maritime-sector",
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
    id: "water-resources-infrastructure",
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
    id: "development-partners-donor-projects",
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
    id: "environmental-research-sector",
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

function normalizePoints(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
}

async function getSectors(): Promise<SectorItem[]> {
  try {
    const response = await fetch(`${API_URL}/client-sectors`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return fallbackSectors
    }

    const payload = await response.json()
    const rows = (payload.data ?? []) as Array<{
      id: string
      title?: string | null
      body?: string | null
      points?: unknown
    }>

    const sectors = rows
      .filter((item) => item.id && item.title?.trim() && item.body?.trim())
      .map((item) => ({
        id: item.id,
        title: item.title!.trim(),
        body: item.body!.trim(),
        points: normalizePoints(item.points),
      }))

    return sectors.length > 0 ? sectors : fallbackSectors
  } catch {
    return fallbackSectors
  }
}

export default async function ClientsSectorsPage() {
  const sectors = await getSectors()
  const structuredData = createJsonLdGraph([
    createWebPageSchema({
      path: "/clients-sectors",
      name: "Clients & Sectors",
      description: pageDescription,
      type: "CollectionPage",
    }),
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Clients & Sectors", path: "/clients-sectors" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/clients-sectors")}#sector-list`,
      name: "Client sectors supported by MCS",
      itemListElement: sectors.map((sector, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: sector.title,
        description: sector.body,
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
              Clients & Sectors
            </div>
            <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
              Supporting Diverse{" "}
              <span className="text-primary">Waterway Stakeholders</span>
            </h1>
            <p className="mt-8 text-base leading-relaxed text-slate-500 md:text-xl dark:text-slate-400">
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
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.body}
              </p>
              {item.points && item.points.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>

      <Clients />
    </main>
  )
}
