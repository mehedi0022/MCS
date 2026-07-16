import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  trainingItemSchema,
  trainingItemUpdateSchema,
  trainingPageSchema,
  trainingPageUpdateSchema,
  type TrainingItemInput,
  type TrainingPageInput,
} from "../validations/training.validation.js"

const defaultTrainingPage = {
  heroBadge: "Training & Capacity Development",
  heroTitleLine1: "Build Teams That Deliver Accurate Waterway Data",
  heroTitleHighlight: "Accurate Waterway Data",
  heroDescription:
    "Structured, field-driven training for hydrography, GIS, morphology, and nautical charting, designed for practical project execution across Bangladesh.",
  snapshotEyebrow: "Program Snapshot",
  learningPathTitle: "Learning Path",
  outcomesTitle: "Expected Outcomes",
  ctaTitle: "Need a Custom Training Plan?",
  ctaDescription:
    "We design role-based programs for agencies, project teams, and technical units aligned with your timeline, tools, and outcomes.",
  primaryButtonText: "Request Training Plan",
  primaryButtonLink: "/contact",
  secondaryButtonText: "View FAQ",
  secondaryButtonLink: "/faq",
  isActive: true,
} satisfies TrainingPageInput

async function ensureTrainingPage() {
  return prisma.trainingPage.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      ...defaultTrainingPage,
    },
  })
}

async function buildTrainingPayload(includeInactive: boolean) {
  const [page, items] = await Promise.all([
    ensureTrainingPage(),
    prisma.trainingItem.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ])

  return { page, items }
}

export const getTrainingPublic: RequestHandler = async (_req, res, next) => {
  try {
    const payload = await buildTrainingPayload(false)
    return sendSuccess(res, payload)
  } catch (error) {
    return next(error)
  }
}

export const getTrainingAdmin: RequestHandler = async (_req, res, next) => {
  try {
    const payload = await buildTrainingPayload(true)
    return sendSuccess(res, payload)
  } catch (error) {
    return next(error)
  }
}

export const updateTrainingPage: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<Partial<TrainingPageInput>>(
      trainingPageUpdateSchema,
      req.body
    )
    const row = await prisma.trainingPage.upsert({
      where: { id: "main" },
      update: data,
      create: {
        id: "main",
        ...defaultTrainingPage,
        ...data,
      },
    })
    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const replaceTrainingPage: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<TrainingPageInput>(trainingPageSchema, req.body)
    const row = await prisma.trainingPage.upsert({
      where: { id: "main" },
      update: data,
      create: {
        id: "main",
        ...data,
      },
    })
    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const createTrainingItem: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<TrainingItemInput>(trainingItemSchema, req.body)
    const row = await prisma.trainingItem.create({ data })
    return sendSuccess(res, row, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateTrainingItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const data = await validateBody<Partial<TrainingItemInput>>(
      trainingItemUpdateSchema,
      req.body
    )
    const row = await prisma.trainingItem.update({
      where: { id },
      data,
    })
    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const deleteTrainingItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.trainingItem.delete({ where: { id } })
    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
