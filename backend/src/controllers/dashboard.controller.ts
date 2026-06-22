import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"

export const getDashboardSummary: RequestHandler = async (_req, res, next) => {
  try {
    const [
      services,
      projects,
      clients,
      messages,
      unreadMessages,
      heroSlides,
      faqs,
      deliveryApproachSteps,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.project.count(),
      prisma.client.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.heroSlide.count(),
      prisma.faqItem.count(),
      prisma.deliveryApproachStep.count(),
    ])

    return sendSuccess(res, {
      services,
      projects,
      clients,
      messages,
      unreadMessages,
      heroSlides,
      faqs,
      deliveryApproachSteps,
    })
  } catch (error) {
    return next(error)
  }
}
