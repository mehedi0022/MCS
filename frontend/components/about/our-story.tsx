import React from "react"
import { Anchor } from "lucide-react"

export type OurStoryCard = {
  id: "main"
  sinceLabel: string
  headingLine1: string
  headingLine2: string
  storyHtml: string
  badge: string
  title: string
  imageUrl: string
  imagePublicId?: string | null
  isActive: boolean
}

type OurStoryProps = {
  card?: OurStoryCard
}

function sanitizeRichHtml(input: string) {
  if (!input.trim()) return ""
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return input
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<(iframe|object|embed)[\s\S]*?>[\s\S]*?<\/\1>/gi, "")
      .replace(/\son\w+=(["']).*?\1/gi, "")
      .replace(/\s(href|src)=(["'])javascript:[\s\S]*?\2/gi, "")
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(input, "text/html")

  doc.querySelectorAll("script,style,iframe,object,embed").forEach((node) => {
    node.remove()
  })

  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const key = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (key.startsWith("on")) {
        el.removeAttribute(attr.name)
      }
      if ((key === "href" || key === "src") && value.startsWith("javascript:")) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return doc.body.innerHTML
}

const fallbackCard = {
  sinceLabel: "Since 2014",
  headingLine1: "Built by the sea,",
  headingLine2: "for the sea.",
  storyHtml: `<p>Maritime Solutions was founded by a small group of naval architects and former captains who shared a singular realization: the industry was changing faster than the engineering firms could adapt.</p><p>We started in a small office near the Port of Singapore with nothing but a set of blueprints and a commitment to radical transparency. We didn't want to be another generic corporate consultancy; we wanted to be technical partners who understood the vibration of the engine and the weight of the cargo.</p><p>Today, we have grown into a global presence, yet our purpose remains unchanged: providing the engineering backbone for those who navigate the world's most vital waterways.</p>`,
  badge: "Global Impact",
  title: "40+ Ports Optimized Worldwide",
  imageUrl:
    "https://images.unsplash.com/photo-1494459940152-1e911caa8ea0?q=80&w=2787&auto=format&fit=crop",
}

export function OurStory({ card }: OurStoryProps) {
  const visualCard = card ?? fallbackCard
  const safeStoryHtml = sanitizeRichHtml(visualCard.storyHtml)

  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                {visualCard.sinceLabel}
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              {visualCard.headingLine1} <br />
              <span className="font-light italic">{visualCard.headingLine2}</span>
            </h2>
            <div
              className="space-y-6 text-lg leading-relaxed text-muted-foreground [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:text-2xl [&_h3]:font-semibold [&_h4]:text-xl [&_h4]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_p]:mb-5"
              dangerouslySetInnerHTML={{ __html: safeStoryHtml }}
            />
          </div>

          {/* Visual Element */}
          <div className="shadow-maritime-xl group relative aspect-square overflow-hidden rounded-[3rem] border border-slate-200 bg-slate-900 dark:border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${visualCard.imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/45 to-cyan-950/65" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.28),transparent_38%)]" />

            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full border border-white/20 bg-white/5 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full border border-cyan-300/25 bg-cyan-200/10 blur-2xl" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-white/25 bg-white/5 p-8 backdrop-blur-sm">
                <Anchor className="h-20 w-20 text-white/75" />
              </div>
            </div>

            <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/20 bg-black/35 p-6 backdrop-blur-md">
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-cyan-100 uppercase">
                {visualCard.badge}
              </p>
              <p className="text-2xl leading-tight font-bold text-white md:text-3xl">
                {visualCard.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
