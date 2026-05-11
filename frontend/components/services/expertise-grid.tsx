"use client"

import { motion } from "framer-motion"
import { Anchor, CheckCircle2, icons } from "lucide-react"

type ServiceItem = {
  id: string
  title: string
  summary: string
  points: string[]
  icon?: string
  description?: string
}

export function ExpertiseGrid({ services }: { services: ServiceItem[] }) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="mb-4 font-heading text-sm font-bold tracking-[0.4em] text-primary uppercase">
            Core Expertise
          </h2>
          <h3 className="text-4xl leading-tight font-bold tracking-tight text-slate-900 dark:text-white">
            Strategic Interventions <br />
            <span className="text-slate-400">Across the Global Fleet.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl dark:border-white/5 dark:bg-white/5"
            >
              {(() => {
                const Icon =
                  (icons[item.icon as keyof typeof icons] as typeof Anchor) ??
                  Anchor
                return (
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-white/5">
                    <Icon className="h-6 w-6" />
              </div>
                )
              })()}
              <h4 className="mb-3 text-lg font-bold tracking-tight text-slate-900 uppercase transition-colors group-hover:text-primary dark:text-white">
                {item.title}
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.summary}
              </p>
              {item.points.length > 0 ? (
                <ul className="space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.points.map((point, idx) => (
                    <li
                      key={`${item.id}-point-${idx}`}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  No detailed points added yet.
                </p>
              )}
              {item.description && (
                <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500 dark:border-white/10 dark:text-slate-400">
                  {item.description}
                </p>
              )}
              {/* Subtle background glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
