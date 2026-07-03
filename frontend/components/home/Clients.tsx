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
  { id: "2", name: "Cox's Bazar Development Authority (CoxDA)" },
  { id: "3", name: "Payra Port Authority (PPA)", website: "https://ppa.gov.bd" },
  { id: "4", name: "Karnaphuli Ship Builders Ltd." },
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

function ClientLogoCard({ client }: { client: ClientItem }) {
  const website = toSafeWebsite(client.website)
  const content = (
    <div className="group flex h-24 min-w-[230px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-white/10 dark:bg-slate-100">
      <div className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
        {client.logoUrl ? (
          <Image
            src={client.logoUrl}
            alt={client.name}
            fill
            sizes="96px"
            className="object-contain p-1"
          />
        ) : (
          <span className="text-center text-xs font-bold text-slate-500">
            MCS
          </span>
        )}
      </div>
      <span className="line-clamp-2 text-sm font-bold leading-snug text-slate-800">
        {client.name}
      </span>
    </div>
  )

  if (!website) {
    return <div className="shrink-0">{content}</div>
  }

  return (
    <a
      href={website}
      target="_blank"
      rel="noreferrer"
      className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      title={client.name}
    >
      {content}
    </a>
  )
}

export async function Clients() {
  const clients = await getClients()
  const shouldAnimate = clients.length > 1
  const carouselClients = shouldAnimate ? [...clients, ...clients] : clients

  return (
    <section className="overflow-hidden bg-slate-50 py-20 dark:bg-[#020617]">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
              <Handshake className="h-3 w-3" />
              Clients & Partners
            </div>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Organizations We
              <span className="text-slate-500 dark:text-slate-400">
                {" "}
                Serve.
              </span>
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              We work with government agencies, private sector clients, and
              development partners involved in ports, waterways, and coastal
              infrastructure.
            </p>
          </div>
        </div>
      </div>

      <div className="clients-logo-marquee relative">
        <div
          className={`flex gap-4 px-6 ${shouldAnimate ? "clients-logo-track w-max" : "mx-auto w-fit max-w-full flex-wrap justify-center"}`}
        >
          {carouselClients.map((client, index) => (
            <ClientLogoCard
              key={`${client.id}-${index}`}
              client={client}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
