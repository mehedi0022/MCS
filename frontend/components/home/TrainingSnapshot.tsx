import Link from "next/link"

const trainingItems = [
  "Hydrographic surveying",
  "GIS and spatial analysis",
  "Morphology and water resource management",
  "Nautical charting and ENC production",
]

export function TrainingSnapshot() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20 dark:border-white/10 dark:bg-[#020617]/70">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Training & Capacity Building
            </h1>
            <h2 className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              MCS is committed to strengthening local capacity through
              professional training programs.
            </h2>
            <Link
              href="/training"
              className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
            >
              View Training Programs
            </Link>
          </div>

          <div className="space-y-3">
            {trainingItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
