import { projects } from "@/data/projects"
import { notFound } from "next/navigation"

import { ProjectHeader } from "@/components/projects/details/project-header"
import { ProjectMeta } from "@/components/projects/details/project-meta"
import { ProjectContent } from "@/components/projects/details/project-content"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
      <main className="container mx-auto max-w-4xl px-6 pt-32 pb-24">
        <div className="space-y-16">
          <ProjectHeader
            title={project.title}
            description={project.description}
          />

          {/* New Horizontal Data Bar replaces the Sidebar */}
          <ProjectMeta category={project.category} />

          <ProjectContent cover={project.cover} gallery={project.gallery} />
        </div>
      </main>
    </div>
  )
}
