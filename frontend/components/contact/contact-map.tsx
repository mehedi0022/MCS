"use client"

import { MapPin } from "lucide-react"
import { useSiteSettings } from "@/context/site-settings-context"

const DEFAULT_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d767.3119461092216!2d90.36434752691758!3d23.819619476946706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1b2acf17469%3A0x6969523f05113da9!2sSAILOR%20MIRPUR%20PUROBI!5e0!3m2!1sen!2sbd!4v1777839603439!5m2!1sen!2sbd"

function sanitizeMapEmbedInput(value?: string | null): string {
  const raw = value?.trim()
  if (!raw) return DEFAULT_MAP_EMBED_URL

  const iframeSrcMatch = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i)
  const genericSrcMatch = raw.match(/\ssrc=["']([^"']+)["']/i)
  const candidate = iframeSrcMatch?.[1] ?? genericSrcMatch?.[1] ?? raw
  const decodedCandidate = candidate
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim()

  // Accept flexible Plus Code input:
  // "P9F9+5Q", "P9F9+5Q, Dhaka", "P9F9+5Q Dhaka Bangladesh"
  const plusCodeMatch = decodedCandidate.match(/[A-Z0-9]{2,8}\+[A-Z0-9]{2,4}/i)
  if (plusCodeMatch) {
    const locationQuery = decodedCandidate
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*/g, ", ")
      .trim()
    return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`
  }

  const normalizedCandidate = decodedCandidate.replace(/\s+/g, "")

  try {
    const parsed = new URL(normalizedCandidate)
    const host = parsed.hostname.toLowerCase()
    const pathname = parsed.pathname.toLowerCase()
    const isGoogleMapsEmbed =
      (host === "www.google.com" || host === "google.com") &&
      pathname.startsWith("/maps/embed")
    const pb = parsed.searchParams.get("pb") ?? ""

    return isGoogleMapsEmbed && pb.startsWith("!")
      ? parsed.toString()
      : DEFAULT_MAP_EMBED_URL
  } catch {
    return DEFAULT_MAP_EMBED_URL
  }
}

export function ContactMap() {
  const { settings } = useSiteSettings()

  const mapEmbedUrl = sanitizeMapEmbedInput(settings?.mapLocation)
  const mapLabel =
    settings?.mapLocationText?.trim() || "Mirpur-11 - Dhaka, Bangladesh"

  return (
    <section className="mt-20">
      <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl dark:border-white/10 dark:bg-[#020617]/80">
        {/* Floating Location Badge */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-[#020617]/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            {mapLabel}
          </span>
        </div>

        {/* The Map Embed */}
        <div className="relative aspect-[21/9] min-h-[400px] w-full">
          <iframe
            title="Maritime Solutions Headquarters"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "none" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
          />
        </div>

        {/* Premium Bottom Glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-100 via-transparent to-transparent opacity-70 dark:from-[#020617]" />
      </div>
    </section>
  )
}
