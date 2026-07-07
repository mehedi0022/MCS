"use client"
import { Anchor, Compass, Globe2, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Compass,
    title: "Proven Maritime Expertise",
    desc: "Strong foundation in hydrography, navigation, and marine operations.",
  },
  {
    icon: Anchor,
    title: "Bangladesh-Focused Understanding",
    desc: "Deep knowledge of river morphology, siltation, and coastal dynamics.",
  },
  {
    icon: Globe2,
    title: "Technology-Driven Approach",
    desc: "Modern survey systems, GIS platforms, and advanced modelling tools.",
  },
  {
    icon: Lightbulb,
    title: "Integrated Service Delivery",
    desc: "From field surveys to analysis, modelling, reporting, and implementation support.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-maritime-surface texture-maritime-noise border-y border-border/50 py-24 dark:bg-maritime-abyss">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Sticky Left Column */}
          <div className="flex flex-col justify-center">
            <div className="sticky max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
                <Anchor className="h-3 w-3" />
                Why Choose MCS
              </div>

              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Practical Expertise.{" "}
                <span className="text-muted-foreground">
                  Reliable Data. Trusted Solutions.
                </span>
              </h1>

              <h2 className="text-lg leading-relaxed text-muted-foreground">
                We combine field experience and advanced data workflows to
                deliver practical outcomes for inland waterways, coastal zones,
                ports, and marine infrastructure projects.
              </h2>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid gap-8 sm:grid-cols-2">
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/15 dark:bg-white/5 dark:group-hover:bg-white/10">
                  <item.icon className="h-6 w-6 text-primary transition-colors dark:text-maritime-foam" />
                </div>

                <h4 className="mb-2 text-lg font-bold text-foreground">
                  {item.title}
                </h4>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
