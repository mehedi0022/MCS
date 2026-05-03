"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Anchor } from "lucide-react"
import { cn } from "@/lib/utils"

export function CTA() {
  return (
    <section className="relative h-[550px] w-full overflow-hidden border-y border-border/50">
      {/* 1. Parallax Image Layer */}
      <div
        className={cn(
          "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524522173746-f628baad3644?q=80&w=2832&auto=format&fit=crop')]",
          "bg-cover bg-fixed bg-center transition-transform duration-700 ease-out",
          "brightness-[0.4] dark:brightness-[0.25]"
        )}
        aria-hidden="true"
      />

      {/* 3. Content Layout */}
      <div className="relative z-10 container mx-auto flex h-full items-center justify-center px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
          {/* Subtle Floating Icon */}
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md dark:bg-white/5">
            <Anchor className="h-8 w-8 animate-pulse text-white" />
          </div>

          <h2 className="animate-in text-4xl font-bold tracking-tight text-white drop-shadow-xl duration-1000 fade-in slide-in-from-bottom-6 sm:text-6xl">
            Ready to chart a{" "}
            <span className="text-maritime-teal">new course?</span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl animate-in text-lg leading-relaxed text-white/90 drop-shadow-md delay-200 duration-1000 fade-in slide-in-from-bottom-8 sm:text-xl md:text-2xl">
            Connect with our lead consultants today. Discover how our targeted
            maritime strategies can elevate your operational efficiency and
            compliance.
          </p>

          {/* Action Buttons */}
          <div className="mt-12 flex animate-in flex-col items-center justify-center gap-5 delay-300 duration-1000 slide-in-from-bottom-10 fade-in sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                "group relative h-14 items-center justify-center gap-2 rounded-full bg-white px-10 text-base font-bold text-primary transition-all",
                "hover:shadow-maritime-xl hover:-translate-y-1 hover:bg-white/95 active:scale-[0.98]",
                "flex"
              )}
            >
              Start Your Project
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className={cn(
                "inline-flex h-14 items-center justify-center rounded-full border border-white/40 bg-white/5 px-10 text-base font-bold text-white backdrop-blur-md transition-all",
                "hover:border-white/60 hover:bg-white/10 active:scale-[0.98]"
              )}
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
