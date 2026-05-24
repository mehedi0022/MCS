"use client"

import React from "react"
import { Globe, Clock } from "lucide-react"

const hubs = [
  { city: "Inland Waterways", zone: "Rivers & Channels", status: "Active" },
  { city: "Coastal & Estuarine", zone: "Coastline Coverage", status: "Active" },
  { city: "Ports & Infrastructure", zone: "Marine Operations", status: "Active" },
]

export function GlobalPresence() {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#020617]/80">
      {/* Structural Shape Divider (Top Right Accent) */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative z-10 p-8 md:p-10">
        {/* Header Section */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <Globe className="h-5 w-5 animate-[spin_10s_linear_infinite]" />
            <span className="text-[10px] font-bold tracking-[0.4em] text-foreground/80 uppercase">
              Areas We Support
            </span>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[9px] font-bold text-emerald-500 ring-1 ring-emerald-500/20 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            MCS READY
          </div>
        </div>

        {/* Horizontal Hubs with Vertical Shape Dividers */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-0">
          {hubs.map((hub, index) => (
            <React.Fragment key={hub.city}>
              <div className="flex-1 space-y-2 first:pl-0 last:pr-0 md:px-6">
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary/70 uppercase">
                  {hub.zone}
                </p>
                <h4 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  {hub.city}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-500/50" />
                  <span className="text-[11px] font-semibold text-muted-foreground italic">
                    {hub.status}
                  </span>
                </div>
              </div>

              {/* Vertical Shape Divider (Hidden on Mobile) */}
              {index < hubs.length - 1 && (
                <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent md:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Decorative Element & Status Bar */}
        <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-8">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-medium tracking-wide">
              Flexible Project Engagement
            </span>
          </div>

          <div className="group/progress relative flex flex-col items-end gap-2">
            <span className="text-[9px] font-bold tracking-widest text-muted-foreground/60">
              RESPONSE PRIORITY HIGH
            </span>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-primary/10">
              <div className="h-full w-[98%] bg-gradient-to-r from-primary via-cyan-500 to-emerald-400 transition-all duration-1000 group-hover/progress:w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Shape Divider (Angular Cut) */}
      <div className="absolute right-0 bottom-0 h-16 w-32 translate-x-8 translate-y-8 rotate-45 bg-primary/5 dark:bg-white/5" />
    </div>
  )
}
