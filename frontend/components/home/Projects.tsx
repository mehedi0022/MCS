"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Ship, Anchor, Globe } from "lucide-react"
import { projects as fallbackProjects } from "@/data/projects"
import { api, type ApiResponse } from "@/lib/api"

type HomeProject = {
  id: string | number
  slug: string
  title: string
  category: string
  description?: string | null
  summary?: string
  imageUrl?: string | null
  cover?: string
  isFeatured?: boolean
}

export function Projects() {
  const [projects, setProjects] = useState<HomeProject[]>(fallbackProjects)

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await api.get<ApiResponse<HomeProject[]>>("/projects")
        const rows = response.data.data
        const featured = rows.filter((project) => project.isFeatured)
        const items = featured.length > 0 ? featured : rows.slice(0, 3)
        if (items.length > 0) {
          setProjects(items)
        }
      } catch {
        setProjects(fallbackProjects)
      }
    }

    void loadProjects()
  }, [])

  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
              <Anchor className="h-3 w-3" />
              Strategic Portfolio
            </div>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Proven Results{" "}
              <span className="text-muted-foreground">at Sea.</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Discover how our strategic interventions and geospatial insights
              have transformed operations for global maritime agencies and
              developers.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-bold tracking-tight text-primary transition-colors hover:text-maritime-ocean"
          >
            Explore Full Portfolio
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group hover:shadow-maritime-xl relative flex flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card transition-all hover:border-primary/30"
            >
              {/* Image Container with Dynamic Label */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={project.imageUrl ?? project.cover ?? "/project1.jpg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Visual Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-maritime-abyss/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />

                {/* Floating Tag */}
                <div className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-xl transition-all group-hover:bg-primary group-hover:ring-primary">
                  <Ship className="h-5 w-5" />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col p-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase">
                    <Globe className="h-3 w-3" />
                    Global Reach
                  </div>
                </div>

                <h4 className="mb-4 font-heading text-2xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h4>

                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {project.summary ?? project.description ?? ""}
                </p>

                {/* Footer / CTA */}
                <div className="mt-auto pt-8">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground transition-all hover:gap-3 hover:text-primary"
                  >
                    View Case Study
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
