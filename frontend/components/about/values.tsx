import React from "react"
import { Shield, Lightbulb, Zap, BarChart, Leaf } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Unwavering Integrity",
    desc: "Our advice is governed by engineering truth, not corporate convenience.",
  },
  {
    icon: Lightbulb,
    title: "Bold Innovation",
    desc: "We actively pursue the technologies that other firms consider impossible.",
  },
  {
    icon: Zap,
    title: "Operational Excellence",
    desc: "We deliver precision in high-stakes environments where every second counts.",
  },
  {
    icon: Leaf,
    title: "Sustainability First",
    desc: "Every design is audited for its long-term impact on our oceanic ecosystems.",
  },
  {
    icon: BarChart,
    title: "Data-Driven Logic",
    desc: "Decisions are rooted in rigorous analytics and structural modeling.",
  },
]

export function Values() {
  return (
    <section className="border-t border-slate-200 bg-white py-24 md:py-32 dark:border-white/5 dark:bg-white/5">
      <div className="container mx-auto mb-16 px-6 text-center">
        <h2 className="mb-4 text-sm font-bold tracking-[0.3em] text-primary uppercase dark:text-maritime-teal">
          Values
        </h2>
        <h3 className="text-3xl font-bold text-foreground sm:text-5xl">
          The Principles That Guide Our Fleet
        </h3>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {values.map((val, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl dark:border-white/10 dark:bg-[#020617]/70"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 dark:bg-white/5 dark:text-maritime-foam">
                <val.icon className="h-6 w-6" />
              </div>
              <h4 className="mb-3 text-lg font-bold text-foreground">
                {val.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
