import React from "react"

export type JourneyItem = {
  id: string
  year: string
  title: string
  desc: string
}

const fallbackMilestones: JourneyItem[] = [
  {
    id: "fallback-1",
    year: "2014",
    title: "The Maiden Voyage",
    desc: "Founded in Singapore by a team of 4 naval architects focused on regional port efficiency.",
  },
  {
    id: "fallback-2",
    year: "2015",
    title: "Pacific Expansion",
    desc: "Opened operations across 12 Pacific ports, growing our fleet monitoring network.",
  },
  {
    id: "fallback-3",
    year: "2016",
    title: "Safety First",
    desc: "Launched our proprietary hazard detection system, reducing incidents by 40%.",
  },
  {
    id: "fallback-4",
    year: "2017",
    title: "Expanding Horizons",
    desc: "Established our European headquarters in Rotterdam, doubling our engineering capacity.",
  },
  {
    id: "fallback-5",
    year: "2020",
    title: "Digital Twin Launch",
    desc: "Pioneered the industry's first real-time digital twin simulation for vessel logistics.",
  },
  {
    id: "fallback-6",
    year: "2024",
    title: "Sustainable Future",
    desc: "Committed to zero-emission infrastructure projects across the Middle East and Asia.",
  },
]

export function Journey({ milestones = fallbackMilestones }: { milestones?: JourneyItem[] }) {
  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-24 md:py-32 dark:border-white/5 dark:bg-[#020617]/50">
      {/* Heading */}
      <div className="container mx-auto mb-14 px-6 text-center md:mb-20">
        <h2 className="mb-4 text-xs font-bold tracking-[0.4em] text-primary uppercase">
          The Journey
        </h2>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Decades of Navigational Mastery
        </h3>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-slate-50 to-transparent dark:from-[#020617]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-slate-50 to-transparent dark:from-[#020617]" />

        {/* Outer wrapper — pause on hover */}
        <div className="group flex gap-6 px-5" style={{ width: "max-content" }}>
          {/* Set A */}
          <div className="flex [animation:marquee_35s_linear_infinite] gap-6 group-hover:[animation-play-state:paused]">
            {milestones.map((item, i) => (
              <Card key={`a-${i}`} item={item} i={i} />
            ))}
          </div>

          {/* Set B — identical clone, same animation */}
          <div className="flex [animation:marquee_35s_linear_infinite] gap-6 group-hover:[animation-play-state:paused]">
            {milestones.map((item, i) => (
              <Card key={`b-${i}`} item={item} i={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
    </section>
  )
}

function Card({ item, i }: { item: JourneyItem; i: number }) {
  const isTop = i % 2 === 0
  return (
    <div className="relative h-[320px] w-[300px] shrink-0 md:w-[340px]">
      {/* Card */}
      <div className={`absolute left-0 w-full ${isTop ? "top-0" : "bottom-0"}`}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl md:p-7 dark:border-white/10 dark:bg-[#020617]/80">
          <span className="mb-2 block text-2xl font-bold text-primary md:text-3xl">
            {item.year}
          </span>
          <h4 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
            {item.title}
          </h4>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {item.desc}
          </p>
        </div>
      </div>
    </div>
  )
}
