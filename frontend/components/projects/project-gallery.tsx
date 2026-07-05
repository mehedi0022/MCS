"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Globe, Ship } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProjectGallery({
  initialProjects,
}: {
  initialProjects: Array<{
    id: string
    slug: string
    title: string
    category: string
    imageUrl?: string | null
    cover?: string
    summary?: string | null
    description?: string | null
    client?: string
    location?: string
    year?: number
  }>
}) {
  const [activeTab, setActiveTab] = useState("All")
  const categories = [
    "All",
    ...Array.from(
      new Set(
        initialProjects
          .map((project) => project.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    ),
  ]

  const filtered = initialProjects.filter((p) =>
    activeTab === "All" ? true : p.category === activeTab
  )

  return (
    <>
      <section className="sticky top-0 z-30 border-y border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#020617]/80">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "rounded-full px-5 py-2 text-xs font-bold tracking-wide whitespace-nowrap transition-all",
                    activeTab === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            layout
            className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <div className="group hover:shadow-maritime-xl relative flex flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card transition-all hover:border-primary/30">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={
                            project.imageUrl ?? project.cover ?? "/project1.jpg"
                          }
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="line-clamp-1 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-maritime-abyss/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
                        <div className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-xl transition-all group-hover:bg-primary group-hover:ring-primary">
                          <Ship className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-8">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase dark:text-maritime-teal">
                            {project.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase">
                            <Globe className="h-3 w-3" />
                            Bangladesh Focus
                          </div>
                        </div>

                        <h3 className="mb-4 font-heading text-2xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                          {project.title}
                        </h3>
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {project.summary ?? project.description ?? ""}
                        </p>

                        <div className="mt-auto pt-8">
                          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground transition-all hover:gap-3 hover:text-primary">
                            View Case Study
                            <ArrowRight className="h-4 w-4 text-primary" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}
