import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import {
  cleanupCloudinaryUploads,
  uploadToCloudinary,
} from "../services/cloudinary.service.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateBody } from "../utils/validate.js"
import {
  ourStorySchema,
  ourStoryUpdateSchema,
  type OurStoryInput,
} from "../validations/our-story.validation.js"

export const getOurStoryPublic: RequestHandler = async (_req, res, next) => {
  try {
    const row = await prisma.ourStoryCard.findUnique({
      where: { id: "main" },
    })
    if (!row || !row.isActive) {
      return sendSuccess(res, null)
    }
    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const getOurStoryAdmin: RequestHandler = async (_req, res, next) => {
  try {
    const row = await prisma.ourStoryCard.findUnique({
      where: { id: "main" },
    })
    return sendSuccess(res, row)
  } catch (error) {
    return next(error)
  }
}

export const upsertOurStory: RequestHandler = async (req, res, next) => {
  const uploadedPublicIds: string[] = []

  try {
    const data = await validateBody<OurStoryInput>(ourStorySchema, req.body)
    const existing = await prisma.ourStoryCard.findUnique({
      where: { id: "main" },
    })

    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    if (uploadResult) {
      uploadedPublicIds.push(uploadResult.public_id)
    }

    if (!uploadResult && !existing?.imageUrl) {
      throw new ApiError(422, "Image is required")
    }

    const row = await prisma.ourStoryCard.upsert({
      where: { id: "main" },
      create: {
        id: "main",
        sinceLabel: data.sinceLabel,
        headingLine1: data.headingLine1,
        headingLine2: data.headingLine2,
        storyHtml: data.storyHtml,
        badge: data.badge,
        title: data.title,
        imageUrl: uploadResult?.secure_url ?? "",
        isActive: data.isActive ?? true,
      },
      update: {
        sinceLabel: data.sinceLabel,
        headingLine1: data.headingLine1,
        headingLine2: data.headingLine2,
        storyHtml: data.storyHtml,
        badge: data.badge,
        title: data.title,
        imageUrl: uploadResult?.secure_url ?? existing?.imageUrl ?? undefined,
        isActive: data.isActive,
      },
    })

    return sendSuccess(res, row)
  } catch (error) {
    await cleanupCloudinaryUploads(uploadedPublicIds)
    return next(error)
  }
}

export const patchOurStory: RequestHandler = async (req, res, next) => {
  const uploadedPublicIds: string[] = []
  try {
    const existing = await prisma.ourStoryCard.findUnique({
      where: { id: "main" },
    })
    if (!existing) {
      throw new ApiError(404, "Our Story record not found")
    }

    const data = await validateBody<Partial<OurStoryInput>>(
      ourStoryUpdateSchema,
      req.body
    )
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    if (uploadResult) {
      uploadedPublicIds.push(uploadResult.public_id)
    }

    const row = await prisma.ourStoryCard.update({
      where: { id: "main" },
      data: {
        sinceLabel: data.sinceLabel,
        headingLine1: data.headingLine1,
        headingLine2: data.headingLine2,
        storyHtml: data.storyHtml,
        badge: data.badge,
        title: data.title,
        isActive: data.isActive,
        imageUrl: uploadResult?.secure_url ?? undefined,
      },
    })

    return sendSuccess(res, row)
  } catch (error) {
    await cleanupCloudinaryUploads(uploadedPublicIds)
    return next(error)
  }
}
