import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { uploadToCloudinary } from "../services/cloudinary.service.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  projectSchema,
  projectUpdateSchema,
  type ProjectInput,
} from "../validations/project.validation.js"

export const getProjects: RequestHandler = async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    })
    return sendSuccess(res, projects)
  } catch (error) {
    return next(error)
  }
}

export const createProject: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<ProjectInput>(projectSchema, req.body)
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    const project = await prisma.project.create({
      data: {
        ...data,
        imageUrl: uploadResult?.secure_url ?? data.imageUrl,
      },
    })
    return sendSuccess(res, project, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateProject: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const data = await validateBody<Partial<ProjectInput>>(
      projectUpdateSchema,
      req.body
    )
    const uploadResult = req.file ? await uploadToCloudinary(req.file) : null
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        imageUrl: uploadResult?.secure_url ?? data.imageUrl,
      },
    })
    return sendSuccess(res, project)
  } catch (error) {
    return next(error)
  }
}

export const deleteProject: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    await prisma.project.delete({ where: { id } })
    return sendSuccess(res, { deleted: true })
  } catch (error) {
    return next(error)
  }
}
