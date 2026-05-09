import nodemailer from "nodemailer"
import { env } from "../config/env.js"
import { ApiError } from "../utils/api.js"

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

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
      <h2 style="margin-bottom:8px;">Hello ${params.recipientName},</h2>
      <p style="margin-top:0;">Thank you for contacting MCS. Here is our response:</p>
      <blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #0ea5e9;background:#f8fafc;">
        ${params.replyMessage.replace(/\n/g, "<br/>")}
      </blockquote>
      <p style="margin-bottom:6px;"><strong>Your original message:</strong></p>
      <blockquote style="margin:0;padding:12px 16px;border-left:4px solid #cbd5e1;background:#f8fafc;">
        ${params.originalMessage.replace(/\n/g, "<br/>")}
      </blockquote>
      <p style="margin-top:20px;">Best regards,<br/>${env.SMTP_FROM_NAME}</p>
    </div>
  `

  await transporter.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_USER}>`,
    to: params.to,
    subject: params.subject,
    html,
  })
}
