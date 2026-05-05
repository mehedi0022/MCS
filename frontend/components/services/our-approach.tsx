"use client"

import React from "react"
import { motion } from "framer-motion"
import { Search, PenTool, Activity, ShieldCheck } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: <Search className="h-5 w-5" />,
    title: "Initial Intelligence",
    desc: "Deep-dive data extraction to understand technical constraints and variables.",
  },
  {
    num: "02",
    icon: <PenTool className="h-5 w-5" />,
    title: "Strategic Modeling",
    desc: "Digital twin simulations to pressure-test solutions before deployment.",
  },
  {
    num: "03",
    icon: <Activity className="h-5 w-5" />,
    title: "Precise Execution",
    desc: "On-site implementation led by senior consultants with zero-compromise specs.",
  },
  {
    num: "04",
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Verification",
    desc: "Technical certification and long-term performance monitoring.",
  },
]

export function OurApproach() {
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
            Methodology
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
          >
            The MCS Protocol
          </motion.h3>
        </div>

        <div className="relative">
          {/* Central Horizontal Line */}
          <div className="absolute top-[31px] left-0 hidden h-[1px] w-full bg-slate-200 md:block dark:bg-white/10" />

          <div className="grid grid-cols-1 gap-16 md:grid-cols-4 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
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
                  {step.icon}

                  {/* Number Badge */}
                  <div className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-4 ring-slate-50 dark:ring-[#020617]">
                    {step.num}
                  </div>
                </motion.div>

                {/* Content - Centered */}
                <div className="max-w-[240px] space-y-4">
                  <h4 className="text-lg font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {step.desc}
                  </p>
                </div>

                {/* Mobile Connector */}
                <div className="mt-8 h-12 w-[1px] bg-gradient-to-b from-slate-200 to-transparent last:hidden md:hidden dark:from-white/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
    </section>
  )
}
