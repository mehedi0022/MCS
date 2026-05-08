"use client"

import React from "react"
import { Anchor, BarChart3, Compass, Waves } from "lucide-react"

const capabilities = [
  {
    icon: Compass,
    title: "Hydrography",
    desc: "Precision bathymetric surveys and navigation mapping.",
  },
  {
    icon: BarChart3,
    title: "Geospatial Analysis",
    desc: "Advanced GIS modeling for dynamic riverine data.",
  },
  {
    icon: Waves,
    title: "Waterway Development",
    desc: "End-to-end infrastructure planning and implementation.",
  },
]

export function IntroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      {/* Subtle background detail */}

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Mission & Narrative */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              <div className="mb-16 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
                  <Anchor className="h-3 w-3" />
                  Specialist Engineering Consultancy
                </div>
                <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Navigating the complex waters of{" "}
                  <span className="text-muted-foreground">Bangladesh.</span>
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  We provide a comprehensive range of services tailored to the
                  needs of Bangladesh’s marine and inland water sectors
                </p>
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
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
              <div className="flex items-center gap-6 pt-6">
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
            <div className="glass-strong shadow-maritime-lg space-y-2 rounded-[2.5rem] border-white/5 p-2 dark:bg-white/5">
              <div className="rounded-[2.2rem] bg-background/50 p-8 dark:bg-maritime-abyss/40">
                <h3 className="mb-8 text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">
                  Core Competencies
                </h3>

                <div className="space-y-10">
                  {capabilities.map((item, index) => (
                    <div key={index} className="group flex gap-5">
                      <div className="shadow-maritime-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background ring-1 ring-border transition-all group-hover:scale-110 group-hover:ring-primary/40 dark:bg-white/5 dark:ring-white/10">
                        <item.icon className="h-5 w-5 text-primary dark:text-maritime-teal" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl bg-primary/5 p-5 dark:bg-maritime-teal/5">
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
