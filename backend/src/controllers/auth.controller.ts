import type { RequestHandler } from "express"
import bcrypt from "bcrypt"
import jwt, { type SignOptions } from "jsonwebtoken"
import crypto from "crypto"
import { env } from "../config/env.js"
import { prisma } from "../lib/prisma.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateBody } from "../utils/validate.js"
import { loginSchema, type LoginInput } from "../validations/auth.validation.js"
import type { Role } from "@prisma/client"

type AccessTokenPayload = {
  sub: string
  email: string
  role: Role
  sessionId: string
  type: "access"
}

type RefreshTokenPayload = {
  sub: string
  sessionId: string
  type: "refresh"
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function createAccessToken(payload: Omit<AccessTokenPayload, "type">) {
  return jwt.sign(
    { ...payload, type: "access" satisfies AccessTokenPayload["type"] },
    env.JWT_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"] }
  )
}

function createRefreshToken(payload: Omit<RefreshTokenPayload, "type">, expiresIn: "1d" | "7d") {
  return jwt.sign(
    { ...payload, type: "refresh" satisfies RefreshTokenPayload["type"] },
    env.JWT_SECRET,
    { expiresIn }
  )
}

function setAuthCookies(
  res: Parameters<RequestHandler>[1],
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) {
  const refreshMaxAge = rememberMe ? SEVEN_DAYS_MS : ONE_DAY_MS
  const accessMaxAge = 15 * 60 * 1000
  const cookieBase = {
    httpOnly: true as const,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  }

  res.cookie(env.COOKIE_NAME, accessToken, {
    ...cookieBase,
    maxAge: accessMaxAge,
  })
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieBase,
    maxAge: refreshMaxAge,
  })
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const input = await validateBody<LoginInput>(loginSchema, req.body)
    const user = await prisma.user.findUnique({ where: { email: input.email } })

    if (!user) {
      throw new ApiError(401, "Invalid email or password")
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account is deactivated. Please contact admin.")
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password")
    }
    const rememberMe = Boolean(input.rememberMe)
    const refreshValidityMs = rememberMe ? SEVEN_DAYS_MS : ONE_DAY_MS

    await prisma.authSession.deleteMany({
      where: { userId: user.id },
    })

    const session = await prisma.authSession.create({
      data: {
        userId: user.id,
        accessTokenHash: "pending",
        refreshTokenHash: "pending",
        rememberMe,
        expiresAt: new Date(Date.now() + refreshValidityMs),
      },
    })

    const accessToken = createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    })
    const refreshToken = createRefreshToken(
      { sub: user.id, sessionId: session.id },
      rememberMe ? "7d" : "1d"
    )

    await prisma.authSession.update({
      where: { id: session.id },
      data: {
        accessTokenHash: hashToken(accessToken),
        refreshTokenHash: hashToken(refreshToken),
      },
    })

    setAuthCookies(res, accessToken, refreshToken, rememberMe)

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME]
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required")
    }

    const payload = jwt.verify(refreshToken, env.JWT_SECRET) as RefreshTokenPayload
    if (payload.type !== "refresh") {
      throw new ApiError(401, "Invalid refresh token")
    }

    const session = await prisma.authSession.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    })

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() < Date.now() ||
      session.refreshTokenHash !== hashToken(refreshToken)
    ) {
      throw new ApiError(401, "Refresh token is invalid or expired")
    }

    if (!session.user.isActive) {
      throw new ApiError(403, "Your account is deactivated. Please contact admin.")
    }

    const accessToken = createAccessToken({
      sub: session.user.id,
      email: session.user.email,
      role: session.user.role,
      sessionId: session.id,
    })
    const nextRefreshToken = createRefreshToken(
      { sub: session.user.id, sessionId: session.id },
      session.rememberMe ? "7d" : "1d"
    )

    await prisma.authSession.update({
      where: { id: session.id },
      data: {
        accessTokenHash: hashToken(accessToken),
        refreshTokenHash: hashToken(nextRefreshToken),
      },
    })

    setAuthCookies(res, accessToken, nextRefreshToken, session.rememberMe)
    return sendSuccess(res, { refreshed: true })
  } catch (error) {
    return next(error)
  }
}

export const logout: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME]
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_SECRET) as RefreshTokenPayload
      await prisma.authSession.deleteMany({
        where: { id: payload.sessionId },
      })
    } catch {
      // ignore invalid refresh token on logout
    }
  }

  res.clearCookie(env.COOKIE_NAME, { path: "/" })
  res.clearCookie(env.REFRESH_COOKIE_NAME, { path: "/" })
  return sendSuccess(res, { loggedOut: true })
}

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    })

    if (!user) {
      throw new ApiError(401, "User no longer exists")
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account is deactivated. Please contact admin.")
    }

    return sendSuccess(res, { user })
  } catch (error) {
    return next(error)
  }
}
