import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"

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

function toInt(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return Number.isNaN(value) ? fallback : value
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

function parsePoints(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value !== "string") {
    return []
  }

  try {
    const parsed = JSON.parse(value) as unknown
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    }
  } catch {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function getSectorInput(body: Record<string, unknown>, partial = false) {
  const title = toOptionalString(body.title)
  const sectorBody = toOptionalString(body.body)

  if (!partial && (!title || !sectorBody)) {
    throw new ApiError(422, "title and body are required")
  }

  return {
    title,
    body: sectorBody,
    points: body.points === undefined ? undefined : parsePoints(body.points),
    sortOrder:
      body.sortOrder === undefined ? undefined : toInt(body.sortOrder, 0),
    isPublished:
      body.isPublished === undefined
        ? undefined
        : toBoolean(body.isPublished, true),
  }
}

export const getClientSectors: RequestHandler = async (req, res, next) => {
  try {
    const sectors = await prisma.clientSector.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })

    return sendSuccess(res, sectors)
  } catch (error) {
    return next(error)
  }
}

export const getClientSectorsAdmin: RequestHandler = async (_req, res, next) => {
  try {
    const sectors = await prisma.clientSector.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })

    return sendSuccess(res, sectors)
  } catch (error) {
    return next(error)
  }
}

export const createClientSector: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Record<string, unknown>
    const input = getSectorInput(body)

    const sector = await prisma.clientSector.create({
      data: {
        title: input.title!,
        body: input.body!,
        points: input.points ?? [],
        sortOrder: input.sortOrder ?? 0,
        isPublished: input.isPublished ?? true,
      },
    })

    return sendSuccess(res, sector, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateClientSector: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const existing = await prisma.clientSector.findUnique({ where: { id } })

    if (!existing) {
      throw new ApiError(404, "Client sector not found")
    }

    const body = req.body as Record<string, unknown>
    const input = getSectorInput(body, true)

    const sector = await prisma.clientSector.update({
      where: { id },
      data: {
        title: input.title,
        body: input.body,
        points: input.points,
        sortOrder: input.sortOrder,
        isPublished: input.isPublished,
      },
    })

    return sendSuccess(res, sector)
  } catch (error) {
    return next(error)
  }
}

export const deleteClientSector: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const existing = await prisma.clientSector.findUnique({ where: { id } })

    if (!existing) {
      throw new ApiError(404, "Client sector not found")
    }

    await prisma.clientSector.delete({ where: { id } })

    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
