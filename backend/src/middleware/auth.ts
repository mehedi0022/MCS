import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { env } from "../config/env.js"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../utils/api.js"
import type { Role } from "@prisma/client"

type AuthTokenPayload = {
  sub: string
  email: string
  role: Role
  sessionId: string
  type: "access"
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.COOKIE_NAME]

  if (!token) {
    return next(new ApiError(401, "Authentication required"))
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload
    if (payload.type !== "access") {
      return next(new ApiError(401, "Invalid session token"))
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
    const session = await prisma.authSession.findUnique({
      where: { id: payload.sessionId },
      select: {
        accessTokenHash: true,
        revokedAt: true,
        expiresAt: true,
      },
    })

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() < Date.now() ||
      session.accessTokenHash !== tokenHash
    ) {
      return next(new ApiError(401, "Invalid or expired session"))
    }

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
