import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { ApiError } from "../utils/api.js"

type AuthTokenPayload = {
  sub: string
  email: string
  role: "ADMIN"
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.COOKIE_NAME]

  if (!token) {
    return next(new ApiError(401, "Authentication required"))
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload
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
