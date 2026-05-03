"use client"

import { Anchor } from "lucide-react"

export function AboutHero() {
  return (
    <section className="relative h-[65svh] min-h-[500px] w-full overflow-hidden bg-background">
      {/* Top highlight for continuity with Navbar */}
      <div className="absolute inset-x-0 top-0 z-30 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-maritime-teal/50" />

      {/* Background Cinematic Image */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2938&auto=format&fit=crop')] bg-cover bg-center"
        aria-hidden="true"
      />

      {/* Theme Adaptive Overlays */}
      <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-xl transition-colors duration-700 dark:bg-maritime-abyss/85" />

      {/* Reference Blue Wash for that specific Maritime feel */}
      <div className="dark:bg-maritime-hero absolute inset-0 bg-maritime-navy/10 mix-blend-overlay dark:opacity-90 dark:mix-blend-multiply" />

      {/* Content Container - Centered and Padded to clear Navbar */}
      <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center px-6 pt-24 text-center">
        {/* Premium Badge */}
        <div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-primary/10 bg-white/40 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary backdrop-blur-md duration-1000 fade-in slide-in-from-bottom-4 dark:border-white/10 dark:bg-white/5 dark:text-maritime-foam">
          <Anchor className="h-3.5 w-3.5" />
          ESTABLISHED 2014
        </div>

        {/* Main Headline */}
        <h1 className="animate-in font-heading text-5xl font-bold tracking-tight text-foreground delay-200 duration-1000 fade-in slide-in-from-bottom-8 sm:text-7xl lg:text-8xl dark:text-white">
          Built for the{" "}
          <span className="text-maritime-gradient dark:text-maritime-light-gradient">
            Deep.
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl animate-in text-lg leading-relaxed text-muted-foreground/90 delay-500 duration-1000 slide-in-from-bottom-10 fade-in sm:text-xl md:text-2xl dark:text-maritime-horizon/90">
          A decade of navigating complexity, delivering precision, and
          pioneering sustainable oceanic engineering for a global fleet.
        </p>
      </div>

      {/* Bottom Grounding Gradient */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-32 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </section>
  )
}
