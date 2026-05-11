import { notFound } from "next/navigation"
import { API_URL } from "@/lib/api"
import { projects as fallbackProjects } from "@/data/projects"

import { ProjectHeader } from "@/components/projects/details/project-header"
import { ProjectContent } from "@/components/projects/details/project-content"
import { ProjectMeta } from "@/components/projects/details/project-meta"

interface PageProps {
  params: Promise<{ slug: string }>
}

type ProjectDetails = {
  id?: string
  title: string
  slug: string
  category: string
  summary: string
  description?: string | null
  year?: number | null
  location?: string | null
  client?: string | null
  createdAt?: string
  imageUrl?: string | null
  gallery?: Array<{ url: string; publicId: string }> | string[]
}

async function getProject(slug: string): Promise<ProjectDetails | null> {
  try {
    const response = await fetch(`${API_URL}/projects/slug/${slug}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const payload = await response.json()
    const row = payload.data as Partial<ProjectDetails> | null
    if (!row) return null
    if (!row.slug || !row.title) return null
    return {
      ...row,
      slug: String(row.slug),
      title: String(row.title),
      category: String(row.category ?? "General"),
      summary: String(row.summary ?? ""),
    } as ProjectDetails
  } catch {
    return null
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const apiProject = await getProject(slug)
  const fallbackProject = fallbackProjects.find((p) => p.slug === slug)

  if (!apiProject && !fallbackProject) notFound()

  const gallery = Array.isArray(apiProject?.gallery)
    ? apiProject.gallery.map((item) =>
        typeof item === "string" ? item : item.url
      )
    : fallbackProject?.gallery ?? []

  const cover =
    apiProject?.imageUrl ?? fallbackProject?.cover ?? "/project1.jpg"
  const description =
    apiProject?.description ?? fallbackProject?.description ?? ""
  const summary =
    apiProject?.summary ?? fallbackProject?.summary ?? fallbackProject?.description ?? ""
  const title = apiProject?.title ?? fallbackProject?.title ?? ""
  const category = apiProject?.category ?? fallbackProject?.category ?? null
  const year = apiProject?.year ?? fallbackProject?.year ?? null
  const location = apiProject?.location ?? fallbackProject?.location ?? null
  const client = apiProject?.client ?? fallbackProject?.client ?? null
  const date = apiProject?.createdAt ?? null

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <main className="container mx-auto max-w-4xl px-6 pt-32 pb-24">
        <div className="space-y-16">
          <ProjectHeader
            title={title}
            summary={summary}
          />

          <ProjectMeta
            year={year}
            date={date}
            location={location}
            category={category}
            client={client}
          />

          <ProjectContent
            cover={cover}
            description={description || summary}
            gallery={gallery}
          />
        </div>
      </main>
    </div>
  )
}
