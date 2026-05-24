import { CheckCircle2 } from "lucide-react"

const points = [
  "Accurate - Based on high-quality survey and data processing",
  "Actionable - Focused on real-world implementation",
  "Sustainable - Supporting long-term environmental and operational performance",
]

export function OurApproachHome() {
  return (
    <section className="bg-white py-20 dark:bg-[#020617]">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Our Approach
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            We combine field data, advanced analysis, and practical experience
            to deliver dependable outcomes.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          {points.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
