import { ServicesHero } from "@/components/services/services-hero"
import { ExpertiseGrid } from "@/components/services/expertise-grid"
import {
  fallbackDeliveryApproachSection,
  fallbackDeliveryApproachSteps,
  OurApproach,
  type DeliveryApproachSection,
  type DeliveryApproachStep,
} from "@/components/services/our-approach"
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
  "Integrated hydrographic, geospatial, environmental, and marine consultancy services across Bangladesh."

export const metadata = createPageMetadata({
  title: "Our Services",
  description: pageDescription,
  path: "/services",
  keywords: [
    "hydrographic services",
    "bathymetric surveys",
    "dredging support",
    "GIS mapping services",
  ],
})

type ServiceItem = {
  id: string
  title: string
  summary: string
  points: string[]
  icon?: string
  description?: string
}

type DeliveryApproachData = {
  section: DeliveryApproachSection
  steps: DeliveryApproachStep[]
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

async function getDeliveryApproach(): Promise<DeliveryApproachData> {
  const fallback = {
    section: fallbackDeliveryApproachSection,
    steps: fallbackDeliveryApproachSteps,
  }

  try {
    const response = await fetch(`${API_URL}/delivery-approach`, {
      cache: "no-store",
    })
    if (!response.ok) return fallback

    const payload = await response.json()
    const section = payload.data?.section as
      | Partial<DeliveryApproachSection>
      | undefined
    const rows = (payload.data?.steps ?? []) as Array<{
      id: string
      title: string
      description: string
      iconKey?: string | null
    }>

    return {
      section: {
        eyebrow:
          section?.eyebrow?.trim() || fallbackDeliveryApproachSection.eyebrow,
        title: section?.title?.trim() || fallbackDeliveryApproachSection.title,
        isActive: section?.isActive ?? true,
      },
      steps: rows
        .filter((item) => item.id && item.title?.trim())
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description ?? "",
          iconKey: item.iconKey ?? "Search",
        })),
    }
  } catch {
    return fallback
  }
}

export default async function ServicesPage() {
  const [services, deliveryApproach] = await Promise.all([
    getServices(),
    getDeliveryApproach(),
  ])
  const structuredData = createJsonLdGraph([
    createWebPageSchema({
      path: "/services",
      name: "Our Services",
      description: pageDescription,
      type: "CollectionPage",
    }),
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/services")}#services-list`,
      name: "Marine consultancy services",
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: service.title,
          description: service.summary || service.description,
          provider: {
            "@id": absoluteUrl("#organization"),
          },
          areaServed: {
            "@type": "Country",
            name: "Bangladesh",
          },
        },
      })),
    },
  ])

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      <ServicesHero />

      {/* Section 1: Expertise */}
      <ExpertiseGrid services={services} />

      {/* Section 2: Our Approach */}
      <OurApproach
        section={deliveryApproach.section}
        steps={deliveryApproach.steps}
      />
    </div>
  )
}
