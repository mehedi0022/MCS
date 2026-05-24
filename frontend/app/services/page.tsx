import { ServicesHero } from "@/components/services/services-hero"
import { ExpertiseGrid } from "@/components/services/expertise-grid"
import { OurApproach } from "@/components/services/our-approach"
import { API_URL } from "@/lib/api"

export const metadata = {
  title: "Our Services | Marine Consultancy Services (MCS)",
  description:
    "Integrated hydrographic, geospatial, environmental, and marine consultancy services across Bangladesh.",
}

type ServiceItem = {
  id: string
  title: string
  summary: string
  points: string[]
  icon?: string
  description?: string
}

const fallbackServices: ServiceItem[] = [
  {
    id: "1",
    title: "Hydrographic & Bathymetric Surveys",
    summary:
      "High-accuracy hydrographic surveys for navigation safety, dredging, and marine infrastructure.",
    points: [
      "Multibeam and singlebeam echo sounder surveys",
      "River, estuarine, and coastal bathymetric surveys",
      "Channel condition and navigability assessment",
    ],
    icon: "Anchor",
    description:
      "Field-to-report workflow for reliable depth and channel intelligence.",
  },
  {
    id: "2",
    title: "Dredging Support & Morphological Studies",
    summary:
      "Data-driven support for dredging operations and long-term channel management.",
    points: [
      "Dredging monitoring and supervision",
      "Sediment transport and morphology analysis",
      "Volume calculation and certification",
    ],
    icon: "Compass",
    description:
      "Optimized dredging strategies for safer and more sustainable waterways.",
  },
  {
    id: "3",
    title: "GIS & Geospatial Solutions",
    summary:
      "Spatial data integration and analytics for planning and decision-making.",
    points: [
      "GIS database development and management",
      "Spatial analysis and thematic mapping",
      "Decision-support dashboards",
    ],
    icon: "ShipWheel",
    description:
      "Actionable geospatial outputs for technical and operational teams.",
  },
]

async function getServices(): Promise<ServiceItem[]> {
  try {
    const response = await fetch(`${API_URL}/services`, { cache: "no-store" })
    if (!response.ok) return fallbackServices

    const payload = await response.json()
    const rows = (payload.data ?? []) as Array<{
      id: string
      title: string
      summary?: string
      description?: string
      points?: string[] | null
      icon?: string | null
    }>

    if (!rows.length) return fallbackServices

    const normalized = rows.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary ?? item.description ?? "",
      points: Array.isArray(item.points)
        ? item.points.map((point) => String(point))
        : [],
      icon: item.icon ?? "Anchor",
      description: item.description ?? "",
    }))

    const valid = normalized.filter((item) => item.id && item.title?.trim())
    return valid.length > 0 ? valid : fallbackServices
  } catch {
    return fallbackServices
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <ServicesHero />

      {/* Section 1: Expertise */}
      <ExpertiseGrid services={services} />

      {/* Section 2: Our Approach */}
      <OurApproach />

      {/* Final CTA Section */}
      <section className="border-t border-slate-200 bg-white py-24 dark:border-white/5 dark:bg-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
            Ready to Discuss Your Project?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-slate-500 dark:text-slate-400">
            MCS is ready to support your project with reliable data, technical
            expertise, and end-to-end consultancy services.
          </p>
          <button className="h-14 rounded-2xl bg-primary px-10 font-bold tracking-widest text-white uppercase transition-all hover:shadow-lg hover:shadow-primary/30">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}
