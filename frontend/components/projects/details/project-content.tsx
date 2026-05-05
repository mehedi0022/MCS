import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export function ProjectContent({
  cover,
  gallery,
}: {
  cover: string
  gallery: string[]
}) {
  return (
    <div className="space-y-20">
      {/* Cinematic Hero */}
      <div className="relative aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 shadow-2xl dark:border-white/10 dark:bg-white/5">
        <Image
          src={cover}
          alt="Case Study Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Narrative Section */}
      <div className="grid items-start gap-12 md:grid-cols-2">
        <div className="prose dark:prose-invert">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
            Technical Overview
          </h3>
          <p className="leading-relaxed text-slate-500 dark:text-slate-400">
            The integration process involved standardizing disparate telemetry
            streams into a unified Project Borealis dashboard. By leveraging
            low-latency satellite links, we achieved unprecedented control over
            autonomous maneuvers.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-100/50 p-8 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-6 text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-white">
            Key Results
          </h3>
          <ul className="space-y-4">
            {[
              "99.8% Navigation Accuracy",
              "14% Average Fuel Savings",
              "Remote Pilot Override Latency < 50ms",
            ].map((result) => (
              <li
                key={result}
                className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                {result}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Large-Scale Gallery */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {gallery.map((img, i) => (
          <div
            key={i}
            className="group relative aspect-video overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10"
          >
            <Image
              src={img}
              alt={`View ${i}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
