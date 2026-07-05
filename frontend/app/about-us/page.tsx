import { AboutHero } from "@/components/about/about-hero"
import { MissionVision } from "@/components/about/mission-vision"
import { OurStory, type OurStoryCard } from "@/components/about/our-story"
import { Journey, type JourneyItem } from "@/components/about/journey"
import { Values } from "@/components/about/values"
import { API_URL } from "@/lib/api"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  createBreadcrumbSchema,
  createJsonLdGraph,
  createPageMetadata,
  createWebPageSchema,
} from "@/lib/seo"

const pageDescription =
  "Learn about Marine Consultancy Services (MCS), our mission, values, and experience supporting hydrographic, GIS, environmental, and waterway development projects."

export const metadata = createPageMetadata({
  title: "About Marine Consultancy Services",
  description: pageDescription,
  path: "/about-us",
  keywords: ["about MCS", "marine consultancy Bangladesh", "hydrographic consultancy"],
})

async function getJourneyItems(): Promise<JourneyItem[]> {
  try {
    const response = await fetch(`${API_URL}/journey`, { cache: "no-store" })
    if (!response.ok) return []
    const payload = await response.json()
    const rows = (payload.data ?? []) as JourneyItem[]
    return rows.filter((item) => item.id && item.year && item.title && item.desc)
  } catch {
    return []
  }
}

async function getOurStoryCard(): Promise<OurStoryCard | null> {
  try {
    const response = await fetch(`${API_URL}/our-story`, { cache: "no-store" })
    if (!response.ok) return null
    const payload = await response.json()
    const row = (payload.data ?? null) as OurStoryCard | null
    if (!row) return null
    if (
      !row.id ||
      !row.sinceLabel ||
      !row.headingLine1 ||
      !row.headingLine2 ||
      !row.storyHtml ||
      !row.badge ||
      !row.title ||
      !row.imageUrl
    ) {
      return null
    }
    return row
  } catch {
    return null
  }
}

export default async function AboutPage() {
  const [journeyItems, ourStoryCard] = await Promise.all([
    getJourneyItems(),
    getOurStoryCard(),
  ])
  const structuredData = createJsonLdGraph([
    createWebPageSchema({
      path: "/about-us",
      name: "About Marine Consultancy Services",
      description: pageDescription,
      type: "AboutPage",
    }),
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: "/about-us" },
    ]),
  ])

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <JsonLd data={structuredData} />
      <AboutHero />
      <MissionVision />
      <OurStory card={ourStoryCard ?? undefined} />
      <Journey milestones={journeyItems.length > 0 ? journeyItems : undefined} />
      <Values />
    </main>
  )
}
