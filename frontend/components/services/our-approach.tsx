"use client"

import React from "react"
import { motion } from "framer-motion"
import { Search, icons } from "lucide-react"

export type DeliveryApproachSection = {
  eyebrow: string
  title: string
  isActive?: boolean
}

export type DeliveryApproachStep = {
  id: string
  title: string
  description: string
  iconKey?: string
}

export const fallbackDeliveryApproachSection: DeliveryApproachSection = {
  eyebrow: "Our Delivery Approach",
  title: "Accurate. Actionable. Sustainable.",
  isActive: true,
}

export const fallbackDeliveryApproachSteps: DeliveryApproachStep[] = [
  {
    id: "field-data-collection",
    iconKey: "Search",
    title: "Field Data Collection",
    description:
      "High-quality survey and monitoring data collection from riverine, coastal, and marine environments.",
  },
  {
    id: "technical-analysis",
    iconKey: "PenTool",
    title: "Technical Analysis",
    description:
      "Integrated GIS, modelling, and environmental analysis to produce reliable technical insights.",
  },
  {
    id: "practical-solutions",
    iconKey: "Activity",
    title: "Practical Solutions",
    description:
      "Actionable recommendations aligned with project realities, timelines, and operational needs.",
  },
  {
    id: "sustainable-delivery",
    iconKey: "ShieldCheck",
    title: "Sustainable Delivery",
    description:
      "Implementation support focused on long-term environmental and operational performance.",
  },
]

type OurApproachProps = {
  section?: DeliveryApproachSection
  steps?: DeliveryApproachStep[]
}

export function OurApproach({
  section = fallbackDeliveryApproachSection,
  steps = fallbackDeliveryApproachSteps,
}: OurApproachProps) {
  if (section.isActive === false) {
    return null
  }

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-24 transition-colors duration-500 dark:border-white/5 dark:bg-[#020617]/50">
      <div className="container mx-auto px-6">
        {/* Section Header - Now fully centered */}
        <div className="mb-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-4 text-xs font-bold tracking-[0.5em] text-primary uppercase"
          >
            {section.eyebrow}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
          >
            {section.title}
          </motion.h3>
        </div>

        <div className="relative">
          {/* Central Horizontal Line */}
          <div className="absolute top-[31px] left-0 hidden h-[1px] w-full bg-slate-200 md:block dark:bg-white/10" />

          <div className="grid grid-cols-1 gap-16 md:grid-cols-4 md:gap-8">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                {(() => {
                  const Icon =
                    (icons[step.iconKey as keyof typeof icons] as typeof Search) ??
                    Search
                  const stepNumber = String(i + 1).padStart(2, "0")

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="group relative flex flex-col items-center text-center"
                    >
                      {/* Glowing Icon Container */}
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 15px rgba(20,184,166,0.1)",
                            "0 0 30px rgba(20,184,166,0.4)",
                            "0 0 15px rgba(20,184,166,0.1)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.5, // Staggered glow start
                        }}
                        className="relative z-10 mb-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white bg-white text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white dark:border-slate-800 dark:bg-slate-900"
                      >
                        <Icon className="h-5 w-5" />

                        {/* Number Badge */}
                        <div className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-4 ring-slate-50 dark:ring-[#020617]">
                          {stepNumber}
                        </div>
                      </motion.div>

                      {/* Content - Centered */}
                      <div className="max-w-[240px] space-y-4">
                        <h4 className="text-lg font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>

                      {/* Mobile Connector */}
                      <div className="mt-8 h-12 w-[1px] bg-gradient-to-b from-slate-200 to-transparent last:hidden md:hidden dark:from-white/10" />
                    </motion.div>
                  )
                })()}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
    </section>
  )
}
