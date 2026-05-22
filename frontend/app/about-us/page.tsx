import { AboutHero } from "@/components/about/about-hero"
import { MissionVision } from "@/components/about/mission-vision"
import { OurStory, type OurStoryCard } from "@/components/about/our-story"
import { Journey, type JourneyItem } from "@/components/about/journey"
import { Values } from "@/components/about/values"
import { API_URL } from "@/lib/api"

export const metadata = {
  title: "Our Heritage & Vision | Maritime Solutions",
  description:
    "Discover the story, mission, and core values behind the world's leading maritime consultancy firm.",
}

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

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <AboutHero />
      <MissionVision />
      <OurStory card={ourStoryCard ?? undefined} />
      <Journey milestones={journeyItems.length > 0 ? journeyItems : undefined} />
      <Values />
    </main>
  )
}
