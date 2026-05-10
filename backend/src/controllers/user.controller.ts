import type { RequestHandler } from "express"
import bcrypt from "bcrypt"
import { Role } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateBody } from "../utils/validate.js"
import { createUserSchema, type CreateUserInput } from "../validations/user.validation.js"
import {
  updateUserStatusSchema,
  type UpdateUserStatusInput,
} from "../validations/user.validation.js"

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    return sendSuccess(res, users)
  } catch (error) {
    return next(error)
  }
}

export const getUserRoles: RequestHandler = (_req, res) => {
  return sendSuccess(res, Object.values(Role))
}

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const input = await validateBody<CreateUserInput>(createUserSchema, req.body)

    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      select: { id: true },
    })

    if (existing) {
      throw new ApiError(409, "Email is already in use")
    }

    const passwordHash = await bcrypt.hash(input.password, 12)

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash,
        role: input.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    return sendSuccess(res, user, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const input = await validateBody<UpdateUserStatusInput>(
      updateUserStatusSchema,
      req.body
    )
    const rawUserId = req.params.id
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId

    if (!userId) {
      throw new ApiError(400, "User id is required")
    }

    if (req.user?.id === userId && input.isActive === false) {
      throw new ApiError(400, "You cannot deactivate your own account")
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: input.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    return sendSuccess(res, user)
  } catch (error) {
    return next(error)
  }
}
