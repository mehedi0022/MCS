import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  journeySchema,
  journeyUpdateSchema,
  type JourneyInput,
} from "../validations/journey.validation.js"

export const getJourneyPublic: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await prisma.journeyMilestone.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
    return sendSuccess(res, rows)
  } catch (error) {
    return next(error)
  }
}

export const getJourneyAdmin: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await prisma.journeyMilestone.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
    return sendSuccess(res, rows)
  } catch (error) {
    return next(error)
  }
}

export const createJourney: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<JourneyInput>(journeySchema, req.body)
    const row = await prisma.journeyMilestone.create({ data })
    return sendSuccess(res, row, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateJourney: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const data = await validateBody<Partial<JourneyInput>>(
      journeyUpdateSchema,
      req.body
    )
    const row = await prisma.journeyMilestone.update({
      where: { id },
      data,
    })
    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const deleteJourney: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.journeyMilestone.delete({ where: { id } })
    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}

