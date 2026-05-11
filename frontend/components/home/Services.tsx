import { Anchor, icons } from "lucide-react"
import { API_URL } from "@/lib/api"

type ServiceItem = {
  id: string
  title: string
  summary: string
  iconKey?: string
}

const fallbackServices: ServiceItem[] = [
  {
    id: "1",
    title: "Hydrographic & Bathymetric Surveys",
    summary:
      "Accurate hydrographic and bathymetric surveys for waterways and coastal mapping.",
    iconKey: "Compass",
  },
  {
    id: "2",
    title: "Dredging Monitoring & Morphological Studies",
    summary:
      "Reliable dredging monitoring and morphological studies for efficient project performance.",
    iconKey: "Radar",
  },
  {
    id: "3",
    title: "GIS & Mapping Solutions",
    summary:
      "Advanced GIS and mapping solutions for precise spatial data and analysis.",
    iconKey: "Map",
  },
]

async function getServices(): Promise<ServiceItem[]> {
  try {
    const response = await fetch(`${API_URL}/what-we-do`, { cache: "no-store" })
    if (!response.ok) return fallbackServices
    const payload = await response.json()
    const rows = (payload.data ?? []) as Array<{
      id: string
      title: string
      summary?: string
      description?: string
      iconKey?: string
    }>

    if (!rows.length) return fallbackServices

    const normalized = rows.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary ?? item.description ?? "",
      iconKey: item.iconKey ?? "Anchor",
    }))

    const valid = normalized.filter(
      (item) => item.id && item.title?.trim() && item.summary?.trim()
    )

    return valid.length > 0 ? valid : fallbackServices
  } catch {
    return fallbackServices
  }
}

export async function Services() {
  const services = await getServices()

  return (
    <section className="bg-maritime-surface texture-maritime-noise py-24 dark:bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
            <Anchor className="h-3 w-3" />
            Core Competencies
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            What We <span className="text-muted-foreground">Do.</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            We provide a comprehensive range of services tailored to the needs
            of Bangladesh’s marine and inland water sectors
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="glass group hover:shadow-maritime relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              {/* Ambient Hover Glow */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20 dark:bg-maritime-teal/10" />

              {(() => {
                const Icon =
                  (icons[service.iconKey as keyof typeof icons] as typeof Anchor) ??
                  Anchor
                return (
              <div className="mb-6 inline-flex rounded-lg bg-background/50 p-3 shadow-sm ring-1 ring-border/50 dark:bg-white/5">
                    <Icon className="h-6 w-6 text-maritime-ocean dark:text-maritime-foam" />
              </div>
                )
              })()}
              <h4 className="mb-3 text-xl font-semibold text-foreground">
                {service.title}
              </h4>
              <p className="leading-relaxed text-muted-foreground">
                {service.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
