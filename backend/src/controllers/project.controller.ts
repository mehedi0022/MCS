import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import {
  cleanupCloudinaryUploads,
  uploadToCloudinary,
} from "../services/cloudinary.service.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { generateUniqueProjectSlug } from "../utils/slug.js"
import { validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"

type GalleryImage = {
  url: string
  publicId: string
}

function toOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value
  }
  if (typeof value === "string") {
    return value === "true"
  }
  return fallback
}

function toInt(value: unknown) {
  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

function parseGalleryJson(value: unknown): GalleryImage[] {
  if (typeof value !== "string" || !value.trim()) {
    return []
  }

  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(
      (item): item is GalleryImage =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as GalleryImage).url === "string" &&
        typeof (item as GalleryImage).publicId === "string"
    )
  } catch {
    return []
  }
}

function getProjectInput(body: Record<string, unknown>) {
  const title = toOptionalString(body.title)
  const category = toOptionalString(body.category)
  const summary = toOptionalString(body.summary)

  if (!title || !category || !summary) {
    throw new ApiError(422, "title, category, and summary are required")
  }

  return {
    title,
    category,
    client: toOptionalString(body.client),
    location: toOptionalString(body.location),
    year: toInt(body.year),
    summary,
    description: toOptionalString(body.description),
    isFeatured: toBoolean(body.isFeatured),
    isPublished: toBoolean(body.isPublished, true),
  }
}

function getProjectUpdateInput(body: Record<string, unknown>) {
  return {
    title: toOptionalString(body.title),
    category: toOptionalString(body.category),
    client: toOptionalString(body.client),
    location: toOptionalString(body.location),
    year: toInt(body.year),
    summary: toOptionalString(body.summary),
    description: toOptionalString(body.description),
    isFeatured:
      body.isFeatured === undefined ? undefined : toBoolean(body.isFeatured),
    isPublished:
      body.isPublished === undefined ? undefined : toBoolean(body.isPublished),
  }
}

type UploadedFiles = {
  coverImage?: Express.Multer.File[]
  galleryImages?: Express.Multer.File[]
}

function readUploadedFiles(files: unknown): UploadedFiles {
  if (!files || typeof files !== "object") {
    return {}
  }
  return files as UploadedFiles
}

export const getProjects: RequestHandler = async (_req, res, next) => {
  try {
    const view = _req.query.view
    const isAdminView = view === "admin"
    const projects = await prisma.project.findMany({
      where: isAdminView ? undefined : { isPublished: true },
      orderBy: { createdAt: "desc" },
    })
    return sendSuccess(res, projects)
  } catch (error) {
    return next(error)
  }
}

export const getProjectBySlug: RequestHandler = async (req, res, next) => {
  try {
    const slug = String(req.params.slug)
    const project = await prisma.project.findUnique({ where: { slug } })

    if (!project || !project.isPublished) {
      throw new ApiError(404, "Project not found")
    }

    return sendSuccess(res, project)
  } catch (error) {
    return next(error)
  }
}

export const createProject: RequestHandler = async (req, res, next) => {
  const uploadedPublicIds: string[] = []

  try {
    const body = req.body as Record<string, unknown>
    const input = getProjectInput(body)
    const generatedSlug = await generateUniqueProjectSlug(input.title)
    const existingGallery = parseGalleryJson(body.gallery)
    const files = readUploadedFiles(req.files)

    const coverFile = files.coverImage?.[0]
    const galleryFiles = files.galleryImages ?? []

    let coverImageUrl = toOptionalString(body.imageUrl)
    let coverImagePublicId = toOptionalString(body.imagePublicId)

    if (coverFile) {
      const coverUpload = await uploadToCloudinary(coverFile)
      coverImageUrl = coverUpload.secure_url
      coverImagePublicId = coverUpload.public_id
      uploadedPublicIds.push(coverUpload.public_id)
    }

    const uploadedGallery = await Promise.all(
      galleryFiles.map((file) => uploadToCloudinary(file))
    )
    uploadedPublicIds.push(...uploadedGallery.map((file) => file.public_id))

    const mergedGallery: GalleryImage[] = [
      ...existingGallery,
      ...uploadedGallery.map((item) => ({
        url: item.secure_url,
        publicId: item.public_id,
      })),
    ]

    const project = await prisma.project.create({
      data: {
        ...input,
        slug: generatedSlug,
        imageUrl: coverImageUrl,
        imagePublicId: coverImagePublicId,
        gallery: mergedGallery,
      },
    })

    return sendSuccess(res, project, 201)
  } catch (error) {
    await cleanupCloudinaryUploads(uploadedPublicIds)
    return next(error)
  }
}

export const updateProject: RequestHandler = async (req, res, next) => {
  const uploadedPublicIds: string[] = []

  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) {
      throw new ApiError(404, "Project not found")
    }

    const body = req.body as Record<string, unknown>
    const input = getProjectUpdateInput(body)
    const files = readUploadedFiles(req.files)
    const coverFile = files.coverImage?.[0]
    const galleryFiles = files.galleryImages ?? []

    const retainedGallery = parseGalleryJson(body.gallery)
    const oldGallery = ((existing.gallery as GalleryImage[] | null) ?? []).filter(
      (item) => item?.publicId
    )
    const removedGalleryPublicIds = oldGallery
      .filter(
        (item) => !retainedGallery.some((retained) => retained.publicId === item.publicId)
      )
      .map((item) => item.publicId)

    let nextCoverUrl = toOptionalString(body.imageUrl) ?? existing.imageUrl
    let nextCoverPublicId =
      toOptionalString(body.imagePublicId) ?? existing.imagePublicId

    const previousCoverPublicId = existing.imagePublicId

    if (coverFile) {
      const coverUpload = await uploadToCloudinary(coverFile)
      nextCoverUrl = coverUpload.secure_url
      nextCoverPublicId = coverUpload.public_id
      uploadedPublicIds.push(coverUpload.public_id)
    }

    const uploadedGallery = await Promise.all(
      galleryFiles.map((file) => uploadToCloudinary(file))
    )
    uploadedPublicIds.push(...uploadedGallery.map((file) => file.public_id))

    const mergedGallery: GalleryImage[] = [
      ...retainedGallery,
      ...uploadedGallery.map((item) => ({
        url: item.secure_url,
        publicId: item.public_id,
      })),
    ]

    const generatedSlug = input.title
      ? await generateUniqueProjectSlug(input.title, existing.id)
      : undefined

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...input,
        slug: generatedSlug ?? undefined,
        imageUrl: nextCoverUrl,
        imagePublicId: nextCoverPublicId,
        gallery: mergedGallery,
      },
    })

    const cleanupIds = [...removedGalleryPublicIds]
    if (coverFile && previousCoverPublicId) {
      cleanupIds.push(previousCoverPublicId)
    }
    await cleanupCloudinaryUploads(cleanupIds)

    return sendSuccess(res, project)
  } catch (error) {
    await cleanupCloudinaryUploads(uploadedPublicIds)
    return next(error)
  }
}

export const deleteProject: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) {
      throw new ApiError(404, "Project not found")
    }

    const gallery = ((project.gallery as GalleryImage[] | null) ?? []).filter(
      (item) => item?.publicId
    )

    await prisma.project.delete({ where: { id } })

    await cleanupCloudinaryUploads([
      project.imagePublicId ?? "",
      ...gallery.map((item) => item.publicId),
    ])

    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
