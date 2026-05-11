import { ProjectGallery } from "@/components/projects/project-gallery"
import { Anchor } from "lucide-react"
import { API_URL } from "@/lib/api"
import { projects as fallbackProjects } from "@/data/projects"

export const metadata = {
  title: "Strategic Portfolio | MCS Global",
  description: "Explore our maritime intelligence and infrastructure projects.",
}

type ProjectCard = {
  id: string
  slug: string
  title: string
  category: string
  imageUrl?: string | null
  summary?: string
  description?: string
}

const fallbackProjectCards: ProjectCard[] = fallbackProjects.map((item) => ({
  id: String(item.id),
  slug: item.slug,
  title: item.title,
  category: item.category,
  imageUrl: item.cover,
  summary: item.summary,
  description: item.description,
}))

async function getProjects(): Promise<ProjectCard[]> {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return fallbackProjectCards
    }

    const payload = await response.json()
    const rows = (payload.data ?? []) as ProjectCard[]
    if (!rows.length) return fallbackProjectCards

    const normalized = rows
      .map((item) => ({
        id: String(item.id ?? ""),
        slug: String(item.slug ?? "").trim(),
        title: String(item.title ?? "").trim(),
        category: String(item.category ?? "General").trim() || "General",
        imageUrl: item.imageUrl ?? null,
        summary: item.summary ?? "",
        description: item.description ?? "",
      }))
      .filter((item) => item.id && item.slug && item.title)

    return normalized.length > 0 ? normalized : fallbackProjectCards
  } catch {
    return fallbackProjectCards
  }
}

export default async function ProjectPage() {
  const projects = await getProjects()

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      {/* Hero Header - Static Content */}

      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background patterns */}
        <div className="absolute inset-0 z-0">
          {/* Radial Gradient - Better visibility in both modes */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.12),transparent_60%)]" />

          {/* Grid Pattern - Optimized for Light & Dark */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:border-primary/30 dark:bg-primary/10">
              <Anchor className="h-3 w-3" />
              Strategic Portfolio
            </div>

            <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
              Maritime <span className="text-primary">Intelligence</span>
            </h1>

            <p className="mt-8 text-xl leading-relaxed text-slate-500 dark:text-slate-400">
              A record of strategic interventions, digital twin implementations,
              and sustainable retrofitting across the global blue economy.
            </p>
          </div>
        </div>
      </section>

      {/* Client Component for Filtering and Grid */}
      <ProjectGallery initialProjects={projects} />
    </main>
  )
}
