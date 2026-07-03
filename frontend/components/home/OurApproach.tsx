import { BarChart3, CheckCircle2, ClipboardCheck, SearchCheck } from "lucide-react"

const steps = [
  {
    number: "01",
    label: "Accurate",
    title: "Capture reliable field data",
    description:
      "Survey planning, calibrated equipment, and QA/QC checks keep every technical decision grounded in dependable information.",
    icon: SearchCheck,
    points: ["Field survey control", "Validated datasets"],
  },
  {
    number: "02",
    label: "Actionable",
    title: "Turn analysis into clear direction",
    description:
      "GIS, hydrographic processing, modelling, and engineering review are translated into findings project teams can use.",
    icon: BarChart3,
    points: ["Technical interpretation", "Decision-ready reporting"],
  },
  {
    number: "03",
    label: "Sustainable",
    title: "Support practical delivery",
    description:
      "Recommendations are shaped around operational realities, environmental performance, and long-term infrastructure value.",
    icon: ClipboardCheck,
    points: ["Implementation support", "Long-term performance"],
  },
]

export function OurApproachHome() {
  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-background py-20 dark:bg-[#020617] sm:py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
              <CheckCircle2 className="h-3 w-3" />
              Our Approach
            </div>

            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              From field evidence to{" "}
              <span className="text-muted-foreground">
                practical maritime decisions.
              </span>
            </h2>

            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              We combine field data, advanced analysis, and practical
              experience to deliver dependable outcomes for waterways, ports,
              coastal zones, and marine infrastructure.
            </p>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {["Survey", "Analyze", "Deliver"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-bold text-foreground shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-8 left-8 hidden h-px w-[calc(100%-4rem)] bg-border md:block" />

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="group relative rounded-lg border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-background text-primary shadow-sm transition-colors group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-black tracking-[0.25em] text-muted-foreground">
                      {step.number}
                    </span>
                  </div>

                  <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary uppercase dark:text-maritime-teal">
                    {step.label}
                  </p>
                  <h3 className="text-lg font-bold leading-snug text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-border pt-4">
                    {step.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
