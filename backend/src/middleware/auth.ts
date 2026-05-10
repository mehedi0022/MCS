import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../utils/api.js"
import type { Role } from "@prisma/client"

type AuthTokenPayload = {
  sub: string
  email: string
  role: Role
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.COOKIE_NAME]

  if (!token) {
    return next(new ApiError(401, "Authentication required"))
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload
    const activeUser = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, isActive: true },
    })

    if (!activeUser || !activeUser.isActive) {
      return next(new ApiError(403, "Your account is deactivated"))
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
    return next()
  } catch {
    return next(new ApiError(401, "Invalid or expired session"))
  }
}
