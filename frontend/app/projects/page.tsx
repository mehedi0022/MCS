import { projects } from "@/data/projects"
import { ProjectGallery } from "@/components/projects/project-gallery"
import { Anchor } from "lucide-react"

export const metadata = {
  title: "Strategic Portfolio | MCS Global",
  description: "Explore our maritime intelligence and infrastructure projects.",
}

export default function ProjectPage() {
  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      {/* Hero Header - Static Content */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.08),transparent_50%)]" />
        <div className="relative z-10 container mx-auto px-6 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            <Anchor className="h-3 w-3" />
            Strategic Portfolio
          </div>
          <h1 className="font-heading text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
            Maritime <span className="text-primary">Intelligence</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            A record of strategic interventions, digital twin implementations,
            and sustainable retrofitting across the global blue economy.
          </p>
        </div>
      </section>

      {/* Client Component for Filtering and Grid */}
      <ProjectGallery initialProjects={projects} />
    </main>
  )
}
