"use client"

import { motion } from "framer-motion"
import { Ship, ShieldCheck, Compass, Anchor, Cpu, HardHat } from "lucide-react"

const expertise = [
  {
    icon: <Ship className="h-6 w-6" />,
    title: "Vessel Inspection",
    desc: "Rigorous condition assessments and pre-purchase surveys following international class standards.",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Marine Engineering",
    desc: "Advanced naval architecture and propulsion system design optimized for maximum hydro-efficiency.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Safety Compliance",
    desc: "Implementation of ISM/ISPS protocols and comprehensive regulatory audits for global fleets.",
  },
  {
    icon: <Compass className="h-6 w-6" />,
    title: "Technical Consulting",
    desc: "Strategic advisory on fleet retrofitting, decarbonization paths, and IMO 2030/2050 roadmaps.",
  },
  {
    icon: <Anchor className="h-6 w-6" />,
    title: "Offshore Support",
    desc: "Logistical and technical interventions for energy infrastructure and deep-water installations.",
  },
  {
    icon: <HardHat className="h-6 w-6" />,
    title: "Project Management",
    desc: "Turnkey supervision of dry-docking, newbuild construction, and complex marine salvage.",
  },
]

export function ExpertiseGrid() {
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
          {expertise.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl dark:border-white/5 dark:bg-white/5"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-white/5">
                {item.icon}
              </div>
              <h4 className="mb-3 text-lg font-bold tracking-tight text-slate-900 uppercase transition-colors group-hover:text-primary dark:text-white">
                {item.title}
              </h4>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
              {/* Subtle background glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
