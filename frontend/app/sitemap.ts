import type { MetadataRoute } from "next"
import { getAllProjects } from "@/lib/projects"
import { absoluteUrl } from "@/lib/seo"

const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/clients-sectors", changeFrequency: "monthly", priority: 0.8 },
  { path: "/training", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const projects = await getAllProjects()

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: project.updatedAt ?? project.createdAt ?? lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [absoluteUrl(project.cover)],
    })),
  ]
}
