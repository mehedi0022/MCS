import React from "react"
import { Anchor, Compass, Globe2, Lightbulb } from "lucide-react"

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
            <div className="sticky top-32">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase dark:text-maritime-teal">
                The Maritime Advantage
              </h2>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                We don't just advise. <br className="hidden sm:block" />
                <span className="text-maritime-gradient dark:text-maritime-light-gradient">
                  We engineer success.
                </span>
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                In an industry where delays cost millions, standard consulting
                isn't enough. We combine rigorous technical engineering with
                high-level strategic management to ensure your fleet operates at
                absolute peak performance.
              </p>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="grid gap-8 sm:grid-cols-2">
            {features.map((item, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-white/5">
                  <item.icon className="h-6 w-6 text-primary dark:text-maritime-foam" />
                </div>
                <h4 className="mb-2 text-lg font-bold text-foreground">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
