import React from "react"
import { Anchor, BarChart3, Compass, Waves } from "lucide-react"

const capabilities = [
  {
    icon: Compass,
    title: "Hydrography",
    summary: "Precision bathymetric surveys and navigation mapping.",
  },
  {
    icon: BarChart3,
    title: "Geospatial Analysis",
    summary: "Advanced GIS modeling for dynamic riverine data.",
  },
  {
    icon: Waves,
    title: "Waterway Development",
    summary: "End-to-end infrastructure planning and implementation.",
  },
]

export function IntroSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-card pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 dark:border-white/10">
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Column: Mission & Narrative */}
          <div className="lg:col-span-7">
            <div className="space-y-6 lg:space-y-7">
              <div className="mb-6 max-w-2xl space-y-4 lg:mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
                  <Anchor className="h-3 w-3" />
                  Specialist Engineering Consultancy
                </div>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Navigating the complex waters of{" "}
                  <span className="text-muted-foreground">Bangladesh.</span>
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  We provide a comprehensive range of services tailored to the
                  needs of Bangladesh’s marine and inland water sectors
                </p>
              </div>

              <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  Marine Consultancy Services (MCS) is a specialist consultancy
                  delivering integrated solutions in hydrography, geospatial
                  analysis, and marine and inland waterway development.
                </p>
                <p className="font-medium text-foreground/80">
                  With deep expertise in Bangladesh’s dynamic riverine and
                  coastal environment, we support government agencies,
                  developers, and international partners with reliable data and
                  technical insight.
                </p>
              </div>

              {/* Founder/Expertise Stamp */}
              <div className="flex items-center gap-5 pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 dark:bg-maritime-teal/10">
                  <Anchor className="h-6 w-6 text-primary dark:text-maritime-teal" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest text-foreground uppercase">
                    End-to-End Support
                  </p>
                  <p className="text-xs text-muted-foreground">
                    From Survey & Analysis to Implementation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Capabilities Card Group */}
          <div className="lg:col-span-5">
            <div className="glass-strong shadow-maritime-lg space-y-2 rounded-3xl border-white/5 p-2 dark:bg-white/5">
              <div className="rounded-[1.6rem] bg-background/50 p-6 sm:p-8 dark:bg-maritime-abyss/40">
                <h3 className="mb-6 text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">
                  Core Competencies
                </h3>

                <div className="space-y-7">
                  {capabilities.map((item, index) => {
                    return (
                      <div key={index} className="group flex gap-5">
                        <div className="shadow-maritime-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background ring-1 ring-border transition-all group-hover:scale-110 group-hover:ring-primary/40 dark:bg-white/5 dark:ring-white/10">
                          <item.icon className="h-5 w-5 text-primary dark:text-maritime-teal" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-foreground">
                            {item.title}
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-7 rounded-2xl bg-primary/5 p-5 dark:bg-maritime-teal/5">
                  <p className="text-center text-[11px] font-bold tracking-tighter text-primary uppercase dark:text-maritime-teal">
                    Supporting Bangladesh’s Strategic Waterways Since Foundation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
