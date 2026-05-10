import { ServicesHero } from "@/components/services/services-hero"
import { ExpertiseGrid } from "@/components/services/expertise-grid"
import { OurApproach } from "@/components/services/our-approach"
import { API_URL } from "@/lib/api"

export const metadata = {
  title: "Global Expertise | MCS Maritime Consultancy",
  description:
    "Professional maritime engineering, inspection, and strategic consulting services.",
}

type ServiceItem = {
  id: string
  title: string
  summary: string
}

const fallbackServices: ServiceItem[] = [
  {
    id: "1",
    title: "Vessel Inspection",
    summary:
      "Rigorous condition assessments and pre-purchase surveys following international class standards.",
  },
  {
    id: "2",
    title: "Marine Engineering",
    summary:
      "Advanced naval architecture and propulsion system design optimized for hydro-efficiency.",
  },
  {
    id: "3",
    title: "Safety Compliance",
    summary:
      "Implementation of ISM/ISPS protocols and comprehensive regulatory audits for global fleets.",
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
    }>

    return rows.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary ?? item.description ?? "",
    }))
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
