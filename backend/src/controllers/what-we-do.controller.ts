import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  whatWeDoSchema,
  whatWeDoUpdateSchema,
  type WhatWeDoInput,
} from "../validations/what-we-do.validation.js"

export const getWhatWeDoPublic: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await prisma.whatWeDoItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
    return sendSuccess(res, rows)
  } catch (error) {
    return next(error)
  }
}

export const getWhatWeDoAdmin: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await prisma.whatWeDoItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
    return sendSuccess(res, rows)
  } catch (error) {
    return next(error)
  }
}

export const createWhatWeDo: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<WhatWeDoInput>(whatWeDoSchema, req.body)
    const row = await prisma.whatWeDoItem.create({ data })
    return sendSuccess(res, row, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateWhatWeDo: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const data = await validateBody<Partial<WhatWeDoInput>>(
      whatWeDoUpdateSchema,
      req.body
    )
    const row = await prisma.whatWeDoItem.update({
      where: { id },
      data,
    })
    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const deleteWhatWeDo: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.whatWeDoItem.delete({ where: { id } })
    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}

