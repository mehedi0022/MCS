import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Dynamic Background utilizing your global CSS utility */}
      <div className="bg-maritime-sweep absolute inset-0 dark:opacity-80" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494459940152-1e911caa8ea0?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="glass-modal shadow-maritime-xl mx-auto max-w-4xl rounded-3xl p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl dark:text-white">
            Ready to chart a new course?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground dark:text-white/80">
            Connect with our lead consultants today. Discover how our targeted
            maritime strategies can elevate your operational efficiency and
            compliance.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group shadow-maritime hover:shadow-maritime-lg inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border/50 bg-background/50 px-8 font-medium text-foreground backdrop-blur-md transition-all hover:bg-background/80 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
