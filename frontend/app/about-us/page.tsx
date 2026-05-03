import { AboutHero } from "@/components/about/about-hero"
import { MissionVision } from "@/components/about/mission-vision"
import { OurStory } from "@/components/about/our-story"
import { Journey } from "@/components/about/journey"
import { Values } from "@/components/about/values"

export const metadata = {
  title: "Our Heritage & Vision | Maritime Solutions",
  description:
    "Discover the story, mission, and core values behind the world's leading maritime consultancy firm.",
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AboutHero />
      <MissionVision />
      <OurStory />
      <Journey />
      <Values />
    </main>
  )
}
