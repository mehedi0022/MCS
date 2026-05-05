import { Anchor } from "lucide-react"

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(20,184,166,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-white/[0.02]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            <Anchor className="h-3 w-3" />
            Operational Excellence
          </div>
          <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
            Technical <span className="text-primary">Mastery</span> <br />
            for the Blue Economy.
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-slate-500 dark:text-slate-400">
            From naval architecture to ESG compliance, we provide the
            intelligence needed to navigate the complexities of modern maritime
            logistics.
          </p>
        </div>
      </div>
    </section>
  )
}
