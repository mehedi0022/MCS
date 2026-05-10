import type { RequestHandler } from "express"
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
    const data = await validateBody<ServiceInput>(serviceSchema, req.body)
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    const service = await prisma.service.create({
      data: {
        ...data,
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
    const data = await validateBody<Partial<ServiceInput>>(
      serviceUpdateSchema,
      req.body
    )
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
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
