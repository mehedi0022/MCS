import React from "react"
import { Target, Eye } from "lucide-react"

export function MissionVision() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Mission Card */}
          <div className="glass-strong group hover:shadow-maritime-lg relative overflow-hidden rounded-[2.5rem] p-10 transition-all sm:p-16">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-white/5 dark:text-maritime-teal">
              <Target className="h-7 w-7" />
            </div>
            <h2 className="text-sm font-bold tracking-[0.3em] text-primary uppercase">
              The Mission
            </h2>
            <p className="mt-6 text-2xl leading-tight font-bold text-foreground sm:text-3xl">
              To empower global maritime operations through{" "}
              <span className="text-maritime-gradient">
                engineering precision
              </span>{" "}
              and sustainable innovation.
            </p>
            <p className="mt-6 text-muted-foreground">
              We exist to solve the most complex technical and logistical
              challenges at sea, ensuring our clients operate with maximum
              efficiency, safety, and environmental responsibility.
            </p>
          </div>

          {/* Vision Card */}
          <div className="glass-strong group hover:shadow-maritime-lg relative overflow-hidden rounded-[2.5rem] p-10 transition-all sm:p-16">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-white/5 dark:text-maritime-teal">
              <Eye className="h-7 w-7" />
            </div>
            <h2 className="text-sm font-bold tracking-[0.3em] text-primary uppercase">
              The Vision
            </h2>
            <p className="mt-6 text-2xl leading-tight font-bold text-foreground sm:text-3xl">
              To be the{" "}
              <span className="text-maritime-gradient">
                navigational anchor
              </span>{" "}
              for the world’s most complex oceanic challenges.
            </p>
            <p className="mt-6 text-muted-foreground">
              Our goal is to define the next era of maritime infrastructure,
              where autonomous technology and zero-emission engineering become
              the standard for global trade.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
