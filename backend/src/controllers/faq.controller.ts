import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  faqSchema,
  faqUpdateSchema,
  type FaqInput,
} from "../validations/faq.validation.js"

const faqOrder = [
  { category: "asc" as const },
  { sortOrder: "asc" as const },
  { createdAt: "asc" as const },
]

export const getPublicFaqs: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: faqOrder,
    })

    return sendSuccess(res, rows)
  } catch (error) {
    return next(error)
  }
}

export const getAdminFaqs: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await prisma.faqItem.findMany({
      orderBy: faqOrder,
    })

    return sendSuccess(res, rows)
  } catch (error) {
    return next(error)
  }
}

export const createFaq: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<FaqInput>(faqSchema, req.body)
    const row = await prisma.faqItem.create({ data })

    return sendSuccess(res, row, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateFaq: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const data = await validateBody<Partial<FaqInput>>(faqUpdateSchema, req.body)
    const row = await prisma.faqItem.update({
      where: { id },
      data,
    })

    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const deleteFaq: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.faqItem.delete({ where: { id } })

    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
