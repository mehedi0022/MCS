import type { RequestHandler } from "express"
import bcrypt from "bcrypt"
import jwt, { type SignOptions } from "jsonwebtoken"
import { env } from "../config/env.js"
import { prisma } from "../lib/prisma.js"
import { ApiError, sendSuccess } from "../utils/api.js"
import { validateBody } from "../utils/validate.js"
import { loginSchema, type LoginInput } from "../validations/auth.validation.js"

export const login: RequestHandler = async (req, res, next) => {
  try {
    const input = await validateBody<LoginInput>(loginSchema, req.body)
    const user = await prisma.user.findUnique({ where: { email: input.email } })

    if (!user) {
      throw new ApiError(401, "Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password")
    }

    const jwtOptions: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      jwtOptions
    )

    res.cookie(env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })

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

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(env.COOKIE_NAME, { path: "/" })
  return sendSuccess(res, { loggedOut: true })
}

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true },
    })

    if (!user) {
      throw new ApiError(401, "User no longer exists")
    }

    return sendSuccess(res, { user })
  } catch (error) {
    return next(error)
  }
}
