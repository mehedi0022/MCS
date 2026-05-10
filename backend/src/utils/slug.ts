import slugify from "slugify"
import { prisma } from "../lib/prisma.js"

function toBaseSlug(value: string) {
  const slug = slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  })

  return slug || "project"
}

export async function generateUniqueProjectSlug(
  title: string,
  excludeProjectId?: string
) {
  const baseSlug = toBaseSlug(title)
  let slug = baseSlug
  let suffix = 1

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing || existing.id === excludeProjectId) {
      return slug
    }

    suffix += 1
    slug = `${baseSlug}-${suffix}`
  }
}
