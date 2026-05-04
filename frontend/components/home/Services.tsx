import { services } from "@/data/services"

export function Services() {
  return (
    <section className="bg-maritime-surface texture-maritime-noise py-24 dark:bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-sm font-semibold tracking-wider text-primary uppercase dark:text-maritime-teal">
            Core Competencies
          </h2>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            What We{" "}
            <span className="text-maritime-gradient dark:text-maritime-light-gradient">
              Do
            </span>
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            We provide a comprehensive range of services tailored to the needs
            of Bangladesh’s marine and inland water sectors
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((Service, index) => (
            <div
              key={index}
              className="glass group hover:shadow-maritime relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              {/* Ambient Hover Glow */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20 dark:bg-maritime-teal/10" />

              <div className="mb-6 inline-flex rounded-lg bg-background/50 p-3 shadow-sm ring-1 ring-border/50 dark:bg-white/5">
                <Service.icon className="h-6 w-6 text-maritime-ocean dark:text-maritime-foam" />
              </div>
              <h4 className="mb-3 text-xl font-semibold text-foreground">
                {Service.title}
              </h4>
              <p className="leading-relaxed text-muted-foreground">
                {Service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
