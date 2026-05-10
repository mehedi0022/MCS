function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function nlToBr(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br/>")
}

type WelcomeTemplateParams = {
  recipientName: string
  fromName: string
}

type ReplyTemplateParams = {
  recipientName: string
  fromName: string
  replyMessage: string
  originalMessage: string
}

export function buildWelcomeEmailTemplate(params: WelcomeTemplateParams) {
  const subject = "Thanks for contacting MCS"
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
      <h2 style="margin:0 0 10px;">Hello ${escapeHtml(params.recipientName)},</h2>
      <p style="margin:0 0 12px;">
        Thank you for reaching out to us. We have received your message and our team will review it shortly.
      </p>
      <p style="margin:0 0 12px;">
        We usually reply within one business day.
      </p>
      <p style="margin-top:20px;">Best regards,<br/>${escapeHtml(params.fromName)}</p>
    </div>
  `
  const text = `Hello ${params.recipientName},

Thank you for contacting us. We received your message and our team will review it shortly.
We usually reply within one business day.

Best regards,
${params.fromName}`

  return { subject, html, text }
}

export function buildReplyEmailTemplate(params: ReplyTemplateParams) {
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
      <h2 style="margin-bottom:8px;">Hello ${escapeHtml(params.recipientName)},</h2>
      <p style="margin-top:0;">Thank you for contacting MCS. Here is our response:</p>
      <blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #0ea5e9;background:#f8fafc;">
        ${nlToBr(params.replyMessage)}
      </blockquote>
      <p style="margin-bottom:6px;"><strong>Your original message:</strong></p>
      <blockquote style="margin:0;padding:12px 16px;border-left:4px solid #cbd5e1;background:#f8fafc;">
        ${nlToBr(params.originalMessage)}
      </blockquote>
      <p style="margin-top:20px;">Best regards,<br/>${escapeHtml(params.fromName)}</p>
    </div>
  `

  const text = `Hello ${params.recipientName},

Thank you for contacting MCS. Here is our response:

${params.replyMessage}

Your original message:
${params.originalMessage}

Best regards,
${params.fromName}`

  return { html, text }
}
