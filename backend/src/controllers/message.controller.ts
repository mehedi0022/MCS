import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"
import { sendSuccess } from "../utils/api.js"
import { validateBody, validateParams } from "../utils/validate.js"
import { idParamsSchema, type IdParams } from "../validations/common.validation.js"
import {
  messageSchema,
  messageReplySchema,
  messageStatusSchema,
  type MessageInput,
  type MessageReplyInput,
  type MessageStatusInput,
} from "../validations/message.validation.js"
import {
  isSmtpConfigured,
  sendReplyEmail,
  sendWelcomeEmail,
} from "../services/email.service.js"
import { ApiError } from "../utils/api.js"

export const createMessage: RequestHandler = async (req, res, next) => {
  try {
    const data = await validateBody<MessageInput>(messageSchema, req.body)
    const message = await prisma.contactMessage.create({ data })

    if (isSmtpConfigured()) {
      // Fire-and-forget to keep contact form response fast for end users.
      void sendWelcomeEmail({
          to: message.email,
          recipientName: message.name,
        })
        .catch((welcomeError) => {
          console.error("Welcome email send failed:", welcomeError)
        })
    }

    return sendSuccess(res, message, 201)
  } catch (error) {
    return next(error)
  }
}

export const getMessages: RequestHandler = async (_req, res, next) => {
  try {
    const view = _req.query.view
    const isTrashView = view === "trash"
    const messages = await prisma.contactMessage.findMany({
      where: isTrashView ? { deletedAt: { not: null } } : { deletedAt: null },
      orderBy: { createdAt: "desc" },
    })
    return sendSuccess(res, messages)
  } catch (error) {
    return next(error)
  }
}

export const updateMessageStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const input = await validateBody<MessageStatusInput>(
      messageStatusSchema,
      req.body
    )
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status: input.status },
    })
    return sendSuccess(res, message)
  } catch (error) {
    return next(error)
  }
}

export const restoreMessage: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)

    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!existingMessage) {
      throw new ApiError(404, "Message not found")
    }

    const restoredStatus = existingMessage.repliedAt ? "READ" : "NEW"

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        deletedAt: null,
        status: restoredStatus,
      },
    })

    return sendSuccess(res, {
      restored: true,
      message,
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteMessage: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const forceDelete = req.query.force === "true"

    if (forceDelete) {
      await prisma.contactMessage.delete({ where: { id } })
      return sendSuccess(res, { deleted: true, hardDeleted: true })
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        deletedAt: new Date(),
      },
    })

    return sendSuccess(res, {
      deleted: true,
      hardDeleted: false,
      message,
    })
  } catch (error) {
    return next(error)
  }
}

export const replyToMessage: RequestHandler = async (req, res, next) => {
  try {
    const { id } = await validateParams<IdParams>(idParamsSchema, req.params)
    const input = await validateBody<MessageReplyInput>(messageReplySchema, req.body)

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!message) {
      throw new ApiError(404, "Message not found")
    }

    const subject = input.subject?.trim() || `Re: ${message.subject || "Your Inquiry"}`

    // Keep awaited: only mark as replied after email is successfully sent.
    await sendReplyEmail({
      to: message.email,
      recipientName: message.name,
      subject,
      replyMessage: input.replyMessage,
      originalMessage: message.message,
    })

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: "READ",
        repliedAt: new Date(),
        replyMessage: input.replyMessage,
        repliedBy: req.user?.email ?? "admin",
      },
    })

    return sendSuccess(res, updatedMessage)
  } catch (error) {
    return next(error)
  }
}
