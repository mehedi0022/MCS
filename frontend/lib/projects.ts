import { projects as fallbackProjects } from "@/data/projects"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

export type ProjectDetails = {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  description: string
  cover: string
  imageUrl: string
  gallery: string[]
  year?: number
  location?: string
  client?: string
  createdAt?: string
  updatedAt?: string
}

type GalleryInput = Array<{ url?: string | null; publicId?: string | null } | string>

type ProjectRow = Omit<
  Partial<ProjectDetails>,
  "id" | "cover" | "imageUrl" | "gallery"
> & {
  id?: string | number
  cover?: string | null
  imageUrl?: string | null
  gallery?: GalleryInput | null
}

const normalizedFallbackProjects = fallbackProjects.map((project) =>
  normalizeProject(project)
)

function normalizeGallery(value: GalleryInput | null | undefined) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => (typeof item === "string" ? item : item.url))
    .filter((url): url is string => Boolean(url?.trim()))
}

function normalizeProject(row: ProjectRow): ProjectDetails {
  const slug = String(row.slug ?? "").trim()
  const title = String(row.title ?? "").trim()
  const category = String(row.category ?? "General").trim() || "General"
  const summary = String(row.summary ?? row.description ?? "").trim()
  const description = String(row.description ?? row.summary ?? "").trim()
  const cover = row.imageUrl?.trim() || row.cover?.trim() || "/project1.jpg"

  return {
    id: String(row.id ?? slug),
    slug,
    title,
    category,
    summary,
    description,
    cover,
    imageUrl: cover,
    gallery: normalizeGallery(row.gallery),
    year: row.year ? Number(row.year) : undefined,
    location: row.location?.trim() || undefined,
    client: row.client?.trim() || undefined,
    createdAt: row.createdAt ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
  }
}

function isValidProject(project: ProjectDetails) {
  return Boolean(project.id && project.slug && project.title)
}

export async function getAllProjects(): Promise<ProjectDetails[]> {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return normalizedFallbackProjects
    }

    const payload = await response.json()
    const rows = (payload.data ?? []) as ProjectRow[]
    const projects = rows.map(normalizeProject).filter(isValidProject)

    return projects.length > 0 ? projects : normalizedFallbackProjects
  } catch {
    return normalizedFallbackProjects
  }
}

export async function getProjectBySlug(slug: string) {
  const normalizedSlug = slug.trim()
  const fallbackProject =
    normalizedFallbackProjects.find((project) => project.slug === normalizedSlug) ??
    null

  try {
    const response = await fetch(
      `${API_URL}/projects/slug/${encodeURIComponent(normalizedSlug)}`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return fallbackProject
    }

    const payload = await response.json()
    const row = payload.data as ProjectRow | null
    if (!row) return fallbackProject

    const project = normalizeProject(row)
    return isValidProject(project) ? project : fallbackProject
  } catch {
    return fallbackProject
  }
}
