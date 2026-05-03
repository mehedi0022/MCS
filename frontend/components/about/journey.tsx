import React from "react"

const milestones = [
  {
    year: "2014",
    title: "The Maiden Voyage",
    desc: "Founded in Singapore by a team of 4 naval architects focused on regional port efficiency.",
  },
  {
    year: "2017",
    title: "Expanding Horizons",
    desc: "Established our European headquarters in Rotterdam, doubling our engineering capacity.",
  },
  {
    year: "2020",
    title: "Digital Twin Launch",
    desc: "Pioneered the industry's first real-time digital twin simulation for vessel logistics.",
  },
  {
    year: "2024",
    title: "Sustainable Future",
    desc: "Committed to zero-emission infrastructure projects across the Middle East and Asia.",
  },
]

export function Journey() {
  return (
    <section className="bg-background py-32">
      <div className="container mx-auto mb-20 px-6 text-center">
        <h2 className="mb-4 text-sm font-bold tracking-[0.4em] text-primary uppercase">
          The Journey
        </h2>
        <h3 className="text-4xl font-bold text-foreground sm:text-5xl">
          Decades of Navigational Mastery
        </h3>
      </div>

      <div className="relative container mx-auto max-w-5xl px-6">
        {/* Central Vertical Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent" />

        <div className="space-y-24">
          {milestones.map((item, i) => (
            <div
              key={i}
              className={`relative flex items-center justify-between ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
            >
              {/* Timeline Node */}
              <div className="absolute left-1/2 z-10 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/20 dark:ring-maritime-teal/20" />
                <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-primary/40 dark:bg-maritime-teal/40" />
              </div>

              {/* Content Card */}
              <div className="w-[45%]">
                <div className="glass rounded-3xl p-8 transition-all hover:-translate-y-1">
                  <span className="text-maritime-gradient mb-2 block text-3xl font-bold">
                    {item.year}
                  </span>
                  <h4 className="mb-3 text-xl font-bold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="w-[45%]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
