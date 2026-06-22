import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  deliveryApproachSectionSchema,
  deliveryApproachSectionUpdateSchema,
  deliveryApproachStepSchema,
  deliveryApproachStepUpdateSchema,
  type DeliveryApproachSectionInput,
  type DeliveryApproachStepInput,
} from "../validations/delivery-approach.validation.js"

const defaultSection: DeliveryApproachSectionInput = {
  eyebrow: "Our Delivery Approach",
  title: "Accurate. Actionable. Sustainable.",
  isActive: true,
}

async function ensureSection() {
  return prisma.deliveryApproachSection.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      ...defaultSection,
    },
  })
}

export const getDeliveryApproachPublic: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const section = await ensureSection()
    const steps = section.isActive
      ? await prisma.deliveryApproachStep.findMany({
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        })
      : []

    return sendSuccess(res, { section, steps })
  } catch (error) {
    return next(error)
  }
}

export const getDeliveryApproachAdmin: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const [section, steps] = await Promise.all([
      ensureSection(),
      prisma.deliveryApproachStep.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
    ])

    return sendSuccess(res, { section, steps })
  } catch (error) {
    return next(error)
  }
}

export const updateDeliveryApproachSection: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const data = await validateBody<Partial<DeliveryApproachSectionInput>>(
      deliveryApproachSectionUpdateSchema,
      req.body
    )
    const section = await prisma.deliveryApproachSection.upsert({
      where: { id: "main" },
      update: data,
      create: {
        id: "main",
        ...defaultSection,
        ...data,
      },
    })

    return sendSuccess(res, section)
  } catch (error) {
    return next(error)
  }
}

export const createDeliveryApproachStep: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const data = await validateBody<DeliveryApproachStepInput>(
      deliveryApproachStepSchema,
      req.body
    )
    const step = await prisma.deliveryApproachStep.create({ data })
    return sendSuccess(res, step, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateDeliveryApproachStep: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const data = await validateBody<Partial<DeliveryApproachStepInput>>(
      deliveryApproachStepUpdateSchema,
      req.body
    )
    const step = await prisma.deliveryApproachStep.update({
      where: { id },
      data,
    })

    return sendSuccess(res, step)
  } catch (error) {
    return next(error)
  }
}

export const deleteDeliveryApproachStep: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.deliveryApproachStep.delete({ where: { id } })
    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
