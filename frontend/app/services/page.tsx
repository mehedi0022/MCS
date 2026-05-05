import { ServicesHero } from "@/components/services/services-hero"
import { ExpertiseGrid } from "@/components/services/expertise-grid"
import { OurApproach } from "@/components/services/our-approach"

export const metadata = {
  title: "Global Expertise | MCS Maritime Consultancy",
  description:
    "Professional maritime engineering, inspection, and strategic consulting services.",
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <ServicesHero />

      {/* Section 1: Expertise */}
      <ExpertiseGrid />

      {/* Section 2: Our Approach */}
      <OurApproach />

      {/* Final CTA Section */}
      <section className="border-t border-slate-200 bg-white py-24 dark:border-white/5 dark:bg-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
            Ready to Initialize a Project?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-slate-500 dark:text-slate-400">
            Our strategic advisors are ready to translate complex maritime
            challenges into precise technical solutions.
          </p>
          <button className="h-14 rounded-2xl bg-primary px-10 font-bold tracking-widest text-white uppercase transition-all hover:shadow-lg hover:shadow-primary/30">
            Consult an Expert
          </button>
        </div>
      </section>
    </div>
  )
}
