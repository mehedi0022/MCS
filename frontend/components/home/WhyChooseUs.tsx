"use client"
import { Anchor, Compass, Globe2, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Compass,
    title: "Navigational Precision",
    desc: "Our strategies are built on exact data, removing guesswork from your logistics.",
  },
  {
    icon: Anchor,
    title: "Deep Industry Roots",
    desc: "Founded by former captains and maritime engineers with decades of at-sea experience.",
  },
  {
    icon: Globe2,
    title: "Global Network",
    desc: "Direct relationships with port authorities and regulators across 50+ countries.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Tech",
    desc: "We deploy proprietary software to model and solve complex supply chain bottlenecks.",
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
                The Maritime Advantage
              </div>

              <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                We don't just give advice,{" "}
                <span className="text-muted-foreground">
                  we build success artisans.
                </span>
              </h2>

              <p className="text-lg leading-relaxed text-muted-foreground">
                In an industry where delays cost millions, standard consulting
                isn't enough. We combine rigorous technical engineering with
                high-level strategic management to ensure your fleet operates at
                absolute peak performance.
              </p>
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
