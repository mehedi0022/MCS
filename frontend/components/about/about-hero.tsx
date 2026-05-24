"use client"

import { Anchor } from "lucide-react"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        {/* Radial Gradient - Better visibility in both modes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />

        {/* Grid Pattern - Optimized for Light & Dark */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:border-primary/30 dark:bg-primary/10">
            <Anchor className="h-3 w-3" />
            Marine Consultancy Services
          </div>

          <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
            Technical Expertise for <span className="text-primary">Bangladesh Waterways.</span>
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-slate-500 dark:text-slate-400">
            MCS delivers integrated hydrographic, geospatial, and environmental
            consultancy support for inland and coastal development projects.
          </p>
        </div>
      </div>
    </section>
  )
}
