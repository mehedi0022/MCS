import type { RequestHandler } from "express"
import slugify from "slugify"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"
import { uploadToCloudinary } from "../services/cloudinary.service.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  serviceSchema,
  serviceUpdateSchema,
  type ServiceInput,
} from "../validations/service.validation.js"

function parsePoints(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean)
      }
    } catch {
      return value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    }
  }
  return undefined
}

export const getServices: RequestHandler = async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    })
    return sendSuccess(res, services)
  } catch (error) {
    return next(error)
  }
}

export const getServicesAdmin: RequestHandler = async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    })
    return sendSuccess(res, services)
  } catch (error) {
    return next(error)
  }
}

export const createService: RequestHandler = async (req, res, next) => {
  try {
    const rawBody = req.body as Record<string, unknown>
    const data = await validateBody<ServiceInput>(serviceSchema, {
      ...rawBody,
      points: parsePoints(rawBody.points),
    })
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    const slug = data.slug?.trim()
      ? data.slug
      : slugify(data.title, { lower: true, strict: true })
    const service = await prisma.service.create({
      data: {
        ...data,
        slug,
        icon: uploadResult?.secure_url ?? data.icon,
      },
    })
    return sendSuccess(res, service, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateService: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const rawBody = req.body as Record<string, unknown>
    const data = await validateBody<Partial<ServiceInput>>(
      serviceUpdateSchema,
      {
        ...rawBody,
        points: parsePoints(rawBody.points),
      }
    )
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    const autoSlug =
      data.title && !data.slug
        ? slugify(data.title, { lower: true, strict: true })
        : undefined
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        ...(autoSlug ? { slug: autoSlug } : {}),
        icon: uploadResult?.secure_url ?? data.icon,
      },
    })
    return sendSuccess(res, service)
  } catch (error) {
    return next(error)
  }
}

export const deleteService: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.service.delete({ where: { id } })
    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
