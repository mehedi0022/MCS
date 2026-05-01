import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const projects = [
  {
    title: "Project Borealis",
    category: "Autonomous Navigation",
    image:
      "https://images.unsplash.com/photo-1505299341142-8888fc657cae?q=80&w=2880&auto=format&fit=crop",
    desc: "Implemented AI-driven routing systems for a fleet of 40+ Panamax vessels.",
  },
  {
    title: "Port of Singapore Optimization",
    category: "Infrastructure Analytics",
    image:
      "https://images.unsplash.com/photo-1554522965-dbaf4c01726a?q=80&w=2940&auto=format&fit=crop",
    desc: "Reduced terminal turnaround time by 18% using digital twin simulations.",
  },
  {
    title: "Eco-Retrofit Initiative",
    category: "Sustainability",
    image:
      "https://images.unsplash.com/photo-1605333036665-d069da5c06fc?q=80&w=2940&auto=format&fit=crop",
    desc: "Designed hybrid propulsion retrofits to meet incoming IMO 2030 standards.",
  },
]

export function Projects() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Proven Results at Sea
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover how our strategic interventions have transformed
              operations for leading global maritime corporations.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-medium text-primary hover:text-maritime-ocean"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group hover:shadow-maritime-lg relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span className="mb-2 block text-xs font-medium tracking-wider text-primary uppercase dark:text-maritime-teal">
                    {project.category}
                  </span>
                  <h4 className="mb-3 text-xl font-bold text-card-foreground">
                    {project.title}
                  </h4>
                  <p className="text-muted-foreground">{project.desc}</p>
                </div>
                <div className="mt-6 border-t border-border/50 pt-6">
                  <Link
                    href={`/projects`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    Read Case Study <ArrowRight className="h-4 w-4" />
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
