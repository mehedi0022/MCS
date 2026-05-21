import Image from "next/image"
import { Handshake } from "lucide-react"
import { API_URL } from "@/lib/api"

type ClientItem = {
  id: string
  name: string
  logoUrl?: string | null
  website?: string | null
  isFeatured?: boolean
}

const fallbackClients: ClientItem[] = [
  { id: "1", name: "BIWTA", website: "https://biwta.gov.bd" },
  { id: "2", name: "CPA", website: "https://cpa.gov.bd" },
  { id: "3", name: "Mongla Port Authority", website: "https://mpa.gov.bd" },
  { id: "4", name: "Dhaka WASA", website: "https://dwasa.org.bd" },
]

function toSafeWebsite(url?: string | null) {
  if (!url) return null
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `https://${url}`
}

async function getClients(): Promise<ClientItem[]> {
  try {
    const response = await fetch(`${API_URL}/clients`, { cache: "no-store" })
    if (!response.ok) return fallbackClients

    const payload = await response.json()
    const rows = (payload.data ?? []) as Array<{
      id: string
      name: string
      logoUrl?: string | null
      website?: string | null
      isFeatured?: boolean
    }>

    if (!rows.length) return fallbackClients

    const valid = rows.filter((item) => item.id && item.name?.trim())
    return valid.length > 0 ? valid : fallbackClients
  } catch {
    return fallbackClients
  }
}

export async function Clients() {
  const clients = await getClients()

  return (
    <section className="bg-slate-50 py-20 dark:bg-[#020617]">
      <div className="container mx-auto px-6">
        <div className="mb-12 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
            <Handshake className="h-3 w-3" />
            Trusted Clients
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Organizations We
            <span className="text-slate-500 dark:text-slate-400"> Support.</span>
          </h2>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            From port authorities to engineering institutions, our partners trust
            us for reliable maritime and geospatial execution.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {clients.map((client) => {
            const website = toSafeWebsite(client.website)
            const content = (
              <div className="group flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-white/10 dark:bg-white/5">
                {client.logoUrl ? (
                  <div className="relative h-12 w-full">
                    <Image
                      src={client.logoUrl}
                      alt={client.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {client.name}
                  </span>
                )}
              </div>
            )

            if (!website) {
              return <div key={client.id}>{content}</div>
            }

            return (
              <a
                key={client.id}
                href={website}
                target="_blank"
                rel="noreferrer"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                title={client.name}
              >
                {content}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
