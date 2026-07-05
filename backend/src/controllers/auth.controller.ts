import type { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import {
  isSmtpConfigured,
  sendPasswordResetEmail,
} from "../services/email.service.js";
import { ApiError, sendSuccess } from "../utils/api.js";
import { validateBody } from "../utils/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type ResetPasswordInput,
} from "../validations/auth.validation.js";
import type { Role } from "@prisma/client";

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: Role;
  sessionId: string;
  type: "access";
};

type RefreshTokenPayload = {
  sub: string;
  sessionId: string;
  type: "refresh";
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;
const PASSWORD_RESET_EXPIRES_MINUTES = 30;
const PASSWORD_RESET_EXPIRES_MS = PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000;
const PASSWORD_RESET_RESPONSE =
  "If an active account exists for this email, password reset instructions have been sent.";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createAccessToken(payload: Omit<AccessTokenPayload, "type">) {
  return jwt.sign(
    { ...payload, type: "access" satisfies AccessTokenPayload["type"] },
    env.JWT_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"] },
  );
}

function createRefreshToken(
  payload: Omit<RefreshTokenPayload, "type">,
  expiresIn: "1d" | "7d",
) {
  return jwt.sign(
    { ...payload, type: "refresh" satisfies RefreshTokenPayload["type"] },
    env.JWT_SECRET,
    { expiresIn },
  );
}

function getAuthCookieBaseOptions() {
  return {
    httpOnly: true as const,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    domain: env.COOKIE_DOMAIN || undefined,
  };
}

function setAuthCookies(
  res: Parameters<RequestHandler>[1],
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean,
) {
  const refreshMaxAge = rememberMe ? SEVEN_DAYS_MS : ONE_DAY_MS;
  const accessMaxAge = 15 * 60 * 1000;
  const cookieBase = getAuthCookieBaseOptions();

  res.cookie(env.COOKIE_NAME, accessToken, {
    ...cookieBase,
    maxAge: accessMaxAge,
  });
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieBase,
    maxAge: refreshMaxAge,
  });
}

function createPasswordResetUrl(token: string) {
  const resetUrl = new URL("/reset-password", env.FRONTEND_URL);
  resetUrl.searchParams.set("token", token);
  return resetUrl.toString();
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const input = await validateBody<LoginInput>(loginSchema, req.body);
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account is deactivated. Please contact admin.",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }
    const rememberMe = Boolean(input.rememberMe);
    const refreshValidityMs = rememberMe ? SEVEN_DAYS_MS : ONE_DAY_MS;

    await prisma.authSession.deleteMany({
      where: { userId: user.id },
    });

    const session = await prisma.authSession.create({
      data: {
        userId: user.id,
        accessTokenHash: "pending",
        refreshTokenHash: "pending",
        rememberMe,
        expiresAt: new Date(Date.now() + refreshValidityMs),
      },
    });

    const accessToken = createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });
    const refreshToken = createRefreshToken(
      { sub: user.id, sessionId: session.id },
      rememberMe ? "7d" : "1d",
    );

    await prisma.authSession.update({
      where: { id: session.id },
      data: {
        accessTokenHash: hashToken(accessToken),
        refreshTokenHash: hashToken(refreshToken),
      },
    });

    setAuthCookies(res, accessToken, refreshToken, rememberMe);

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const payload = jwt.verify(
      refreshToken,
      env.JWT_SECRET,
    ) as RefreshTokenPayload;
    if (payload.type !== "refresh") {
      throw new ApiError(401, "Invalid refresh token");
    }

    const session = await prisma.authSession.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() < Date.now() ||
      session.refreshTokenHash !== hashToken(refreshToken)
    ) {
      throw new ApiError(401, "Refresh token is invalid or expired");
    }

    if (!session.user.isActive) {
      throw new ApiError(
        403,
        "Your account is deactivated. Please contact admin.",
      );
    }

    const accessToken = createAccessToken({
      sub: session.user.id,
      email: session.user.email,
      role: session.user.role,
      sessionId: session.id,
    });
    const nextRefreshToken = createRefreshToken(
      { sub: session.user.id, sessionId: session.id },
      session.rememberMe ? "7d" : "1d",
    );

    await prisma.authSession.update({
      where: { id: session.id },
      data: {
        accessTokenHash: hashToken(accessToken),
        refreshTokenHash: hashToken(nextRefreshToken),
      },
    });

    setAuthCookies(res, accessToken, nextRefreshToken, session.rememberMe);
    return sendSuccess(res, { refreshed: true });
  } catch (error) {
    return next(error);
  }
};

export const logout: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        env.JWT_SECRET,
      ) as RefreshTokenPayload;
      await prisma.authSession.deleteMany({
        where: { id: payload.sessionId },
      });
    } catch {
      // ignore invalid refresh token on logout
    }
  }

  const cookieBase = getAuthCookieBaseOptions();
  res.clearCookie(env.COOKIE_NAME, cookieBase);
  res.clearCookie(env.REFRESH_COOKIE_NAME, cookieBase);
  return sendSuccess(res, { loggedOut: true });
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const input = await validateBody<ForgotPasswordInput>(
      forgotPasswordSchema,
      req.body,
    );

    const response: { message: string; resetUrl?: string } = {
      message: PASSWORD_RESET_RESPONSE,
    };

    const user = await prisma.user.findFirst({
      where: { email: input.email, isActive: true },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return sendSuccess(res, response);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const resetUrl = createPasswordResetUrl(rawToken);
    const now = new Date();

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRES_MS),
        },
      }),
    ]);

    try {
      await sendPasswordResetEmail({
        to: user.email,
        recipientName: user.name,
        resetUrl,
        expiresInMinutes: PASSWORD_RESET_EXPIRES_MINUTES,
      });
    } catch (error) {
      console.error("Failed to send password reset email", error);
    }

    if (env.NODE_ENV !== "production" && !isSmtpConfigured()) {
      response.resetUrl = resetUrl;
    }

    return sendSuccess(res, response);
  } catch (error) {
    return next(error);
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const input = await validateBody<ResetPasswordInput>(
      resetPasswordSchema,
      req.body,
    );
    const tokenHash = hashToken(input.token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() < Date.now() ||
      !resetToken.user.isActive
    ) {
      throw new ApiError(400, "Reset link is invalid or expired");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const now = new Date();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: { not: resetToken.id },
        },
        data: { usedAt: now },
      }),
      prisma.authSession.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);

    const cookieBase = getAuthCookieBaseOptions();
    res.clearCookie(env.COOKIE_NAME, cookieBase);
    res.clearCookie(env.REFRESH_COOKIE_NAME, cookieBase);

    return sendSuccess(res, {
      updated: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account is deactivated. Please contact admin.",
      );
    }

    return sendSuccess(res, { user });
  } catch (error) {
    return next(error);
  }
};
