import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import {
  cleanupCloudinaryUploads,
  uploadToCloudinary,
} from "../services/cloudinary.service.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  clientSchema,
  clientUpdateSchema,
  type ClientInput,
} from "../validations/client.validation.js"

function toOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function normalizeWebsite(value: unknown) {
  const website = toOptionalString(value)
  if (!website) return undefined
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website
  }
  return `https://${website}`
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

export const getClients: RequestHandler = async (_req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    })
    return sendSuccess(res, clients)
  } catch (error) {
    return next(error)
  }
}

export const getClientsAdmin: RequestHandler = async (_req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    })
    return sendSuccess(res, clients)
  } catch (error) {
    return next(error)
  }
}

export const createClient: RequestHandler = async (req, res, next) => {
  const uploadedPublicIds: string[] = []

  try {
    const rawBody = req.body as Record<string, unknown>
    const data = await validateBody<ClientInput>(clientSchema, {
      ...rawBody,
      logoUrl: toOptionalString(rawBody.logoUrl),
      website: normalizeWebsite(rawBody.website),
      isFeatured: toBoolean(rawBody.isFeatured),
      isPublished: toBoolean(rawBody.isPublished, true),
    })

    let logoUrl = data.logoUrl
    let logoPublicId: string | undefined

    if (req.file) {
      const upload = await uploadToCloudinary(req.file)
      logoUrl = upload.secure_url
      logoPublicId = upload.public_id
      uploadedPublicIds.push(upload.public_id)
    }

    const client = await prisma.client.create({
      data: {
        name: data.name.trim(),
        website: data.website,
        logoUrl,
        logoPublicId,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
      },
    })

    return sendSuccess(res, client, 201)
  } catch (error) {
    await cleanupCloudinaryUploads(uploadedPublicIds)
    return next(error)
  }
}

export const updateClient: RequestHandler = async (req, res, next) => {
  const uploadedPublicIds: string[] = []

  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const existing = await prisma.client.findUnique({ where: { id } })

    if (!existing) {
      throw new ApiError(404, "Client not found")
    }

    const rawBody = req.body as Record<string, unknown>
    const data = await validateBody<Partial<ClientInput>>(clientUpdateSchema, {
      ...rawBody,
      logoUrl:
        rawBody.logoUrl === undefined
          ? undefined
          : toOptionalString(rawBody.logoUrl),
      website:
        rawBody.website === undefined
          ? undefined
          : normalizeWebsite(rawBody.website),
      isFeatured:
        rawBody.isFeatured === undefined
          ? undefined
          : toBoolean(rawBody.isFeatured),
      isPublished:
        rawBody.isPublished === undefined
          ? undefined
          : toBoolean(rawBody.isPublished),
    })

    let nextLogoUrl = existing.logoUrl
    let nextLogoPublicId = existing.logoPublicId
    let shouldCleanupPreviousLogo = false

    if (req.file) {
      const upload = await uploadToCloudinary(req.file)
      nextLogoUrl = upload.secure_url
      nextLogoPublicId = upload.public_id
      uploadedPublicIds.push(upload.public_id)
      shouldCleanupPreviousLogo = Boolean(existing.logoPublicId)
    } else if (rawBody.logoUrl !== undefined) {
      if (data.logoUrl) {
        nextLogoUrl = data.logoUrl
      } else {
        nextLogoUrl = null
      }
      shouldCleanupPreviousLogo = Boolean(existing.logoPublicId)
      nextLogoPublicId = null
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        website:
          rawBody.website === undefined
            ? undefined
            : (data.website ?? null),
        logoUrl: nextLogoUrl,
        logoPublicId: nextLogoPublicId,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
      },
    })

    if (shouldCleanupPreviousLogo && existing.logoPublicId) {
      await cleanupCloudinaryUploads([existing.logoPublicId])
    }

    return sendSuccess(res, client)
  } catch (error) {
    await cleanupCloudinaryUploads(uploadedPublicIds)
    return next(error)
  }
}

export const deleteClient: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const existing = await prisma.client.findUnique({ where: { id } })

    if (!existing) {
      throw new ApiError(404, "Client not found")
    }

    await prisma.client.delete({ where: { id } })

    if (existing.logoPublicId) {
      await cleanupCloudinaryUploads([existing.logoPublicId])
    }

    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
