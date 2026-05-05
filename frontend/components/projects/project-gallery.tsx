"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  "All",
  "Autonomous Navigation",
  "Infrastructure Analytics",
  "Sustainability",
]

export function ProjectGallery({
  initialProjects,
}: {
  initialProjects: any[]
}) {
  const [activeTab, setActiveTab] = useState("All")

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
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-slate-200 dark:bg-white/5">
                      <Image
                        src={project.cover}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute right-6 bottom-6 translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-2 px-2">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
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
