import nodemailer from "nodemailer"
import { env } from "../config/env.js"
import { ApiError } from "../utils/api.js"
import {
  buildPasswordResetEmailTemplate,
  buildReplyEmailTemplate,
  buildWelcomeEmailTemplate,
} from "../templates/email-templates.js"

const smtpConfigured = Boolean(env.SMTP_USER && env.SMTP_PASS)

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: smtpConfigured
    ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      }
    : undefined,
})

export function isSmtpConfigured() {
  return smtpConfigured
}

export async function sendWelcomeEmail(params: {
  to: string
  recipientName: string
}) {
  if (!smtpConfigured) {
    return
  }

  const template = buildWelcomeEmailTemplate({
    recipientName: params.recipientName,
    fromName: env.SMTP_FROM_NAME,
  })

  await transporter.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_USER}>`,
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}

export async function sendReplyEmail(params: {
  to: string
  recipientName: string
  subject: string
  replyMessage: string
  originalMessage: string
}) {
  if (!smtpConfigured) {
    throw new ApiError(
      500,
      "SMTP is not configured. Set SMTP_USER and SMTP_PASS in backend .env"
    )
  }

  const template = buildReplyEmailTemplate({
    recipientName: params.recipientName,
    fromName: env.SMTP_FROM_NAME,
    replyMessage: params.replyMessage,
    originalMessage: params.originalMessage,
  })

  await transporter.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_USER}>`,
    to: params.to,
    subject: params.subject,
    html: template.html,
    text: template.text,
  })
}

export async function sendPasswordResetEmail(params: {
  to: string
  recipientName: string
  resetUrl: string
  expiresInMinutes: number
}) {
  if (!smtpConfigured) {
    return
  }

  const template = buildPasswordResetEmailTemplate({
    recipientName: params.recipientName,
    fromName: env.SMTP_FROM_NAME,
    resetUrl: params.resetUrl,
    expiresInMinutes: params.expiresInMinutes,
  })

  await transporter.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_USER}>`,
    to: params.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })
}
