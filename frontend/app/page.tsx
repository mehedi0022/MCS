import React from "react"
import { Hero } from "@/components/home/Hero"
import { Services } from "@/components/home/Services"
import { Projects } from "@/components/home/Projects"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
import { CTA } from "@/components/home/CTA"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Services />
      <Projects />
      <WhyChooseUs />
      <CTA />
    </div>
  )
}
