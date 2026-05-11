import React from "react"
import { Anchor } from "lucide-react"

export function OurStory() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                Since 2014
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Built by the sea, <br />
              <span className="font-light italic">for the sea.</span>
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Maritime Solutions was founded by a small group of naval
                architects and former captains who shared a singular
                realization: the industry was changing faster than the
                engineering firms could adapt.
              </p>
              <p>
                We started in a small office near the Port of Singapore with
                nothing but a set of blueprints and a commitment to radical
                transparency. We didn't want to be another generic corporate
                consultancy; we wanted to be technical partners who understood
                the vibration of the engine and the weight of the cargo.
              </p>
              <p>
                Today, we have grown into a global presence, yet our purpose
                remains unchanged: providing the engineering backbone for those
                who navigate the world's most vital waterways.
              </p>
            </div>
          </div>

          {/* Visual Element */}
          <div className="shadow-maritime-xl relative aspect-square overflow-hidden rounded-[3rem] border border-slate-200 bg-slate-900 dark:border-white/10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494459940152-1e911caa8ea0?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Anchor className="h-32 w-32 animate-pulse text-white/20" />
            </div>
            <div className="glass absolute right-10 bottom-10 left-10 rounded-2xl p-6">
              <p className="mb-1 text-sm font-bold tracking-widest text-white uppercase">
                Global Impact
              </p>
              <p className="text-2xl font-bold text-white">
                40+ Ports Optimized Worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
