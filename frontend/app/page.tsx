import { Hero } from "@/components/home/Hero"
import { Services } from "@/components/home/Services"
import { Projects } from "@/components/home/Projects"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
import { CTA } from "@/components/home/CTA"
import { IntroSection } from "@/components/home/IntroSection"
import { OurApproachHome } from "@/components/home/OurApproach"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <IntroSection />
      <Services />
      <Projects />
      <WhyChooseUs />
      <OurApproachHome />
      <CTA />
    </div>
  )
}
