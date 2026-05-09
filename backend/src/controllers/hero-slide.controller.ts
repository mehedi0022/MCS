import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { uploadToCloudinary } from "../services/cloudinary.service.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  heroSlideSchema,
  heroSlideUpdateSchema,
  type HeroSlideInput,
} from "../validations/hero-slide.validation.js"

export const getPublicHeroSlides: RequestHandler = async (_req, res, next) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })

    return sendSuccess(res, slides)
  } catch (error) {
    return next(error)
  }
}

export const getAdminHeroSlides: RequestHandler = async (_req, res, next) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })

    return sendSuccess(res, slides)
  } catch (error) {
    return next(error)
  }
}

export const createHeroSlide: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<HeroSlideInput>(heroSlideSchema, req.body)
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    const imageUrl = uploadResult?.secure_url ?? data.imageUrl

    if (!imageUrl) {
      throw new ApiError(422, "Hero image is required")
    }

    const slide = await prisma.heroSlide.create({
      data: {
        ...data,
        imageUrl,
      },
    })

    return sendSuccess(res, slide, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateHeroSlide: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const data = await validateBody<Partial<HeroSlideInput>>(
      heroSlideUpdateSchema,
      req.body
    )
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...data,
        imageUrl: uploadResult?.secure_url ?? data.imageUrl,
      },
    })

    return sendSuccess(res, slide)
  } catch (error) {
    return next(error)
  }
}

export const deleteHeroSlide: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.heroSlide.delete({ where: { id } })

    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
