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
  const safeName = escapeHtml(params.recipientName)
  const safeFrom = escapeHtml(params.fromName)
  const html = `
    <div style="margin:0;padding:28px 16px;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;border-radius:14px;overflow:hidden;background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 12px 34px rgba(2,6,23,0.08);">
        <tr>
          <td style="padding:22px 26px;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#e2e8f0;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#93c5fd;">Maritime Consulting Solutions</p>
            <h1 style="margin:0;font-size:24px;line-height:1.2;color:#ffffff;">Consultation Request Received</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 26px;">
            <p style="margin:0 0 14px;font-size:16px;font-weight:600;">Hello ${safeName},</p>
            <p style="margin:0 0 12px;font-size:14px;line-height:1.75;color:#334155;">
              Thank you for reaching out to us. We’ve successfully received your message and assigned it to our operations team.
            </p>
            <p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#334155;">
              We usually respond within one business day with the next practical steps for your consultation.
            </p>
            <div style="padding:12px 14px;border-radius:10px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e3a8a;font-size:13px;">
              Your request is now in review. No further action is needed from your side.
            </div>
            <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#334155;">Best regards,<br/><strong>${safeFrom}</strong></p>
          </td>
        </tr>
      </table>
    </div>
  `
  const text = `Hello ${params.recipientName},

Thank you for reaching out to us. We have received your message and assigned it to our operations team.
We usually respond within one business day with the next practical steps for your consultation.

Best regards,
${params.fromName}`

  return { subject, html, text }
}

export function buildReplyEmailTemplate(params: ReplyTemplateParams) {
  const safeName = escapeHtml(params.recipientName)
  const safeFrom = escapeHtml(params.fromName)
  const html = `
    <div style="margin:0;padding:28px 16px;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;border-radius:14px;overflow:hidden;background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 12px 34px rgba(2,6,23,0.08);">
        <tr>
          <td style="padding:22px 26px;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#e2e8f0;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#93c5fd;">Maritime Consulting Solutions</p>
            <h1 style="margin:0;font-size:24px;line-height:1.2;color:#ffffff;">Response From Our Team</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 26px;">
            <p style="margin:0 0 14px;font-size:16px;font-weight:600;">Hello ${safeName},</p>
            <p style="margin:0 0 10px;font-size:14px;line-height:1.75;color:#334155;">
              Thank you for contacting MCS. Please find our response below:
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:14px 0 18px;border-radius:12px;overflow:hidden;border:1px solid #bfdbfe;">
              <tr>
                <td style="padding:10px 14px;background:#dbeafe;color:#1e3a8a;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
                  Our Response
                </td>
              </tr>
              <tr>
                <td style="padding:14px 16px;background:#eff6ff;color:#1e3a8a;font-size:14px;line-height:1.75;">
                  ${nlToBr(params.replyMessage)}
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
              <tr>
                <td style="padding:10px 14px;background:#f1f5f9;color:#475569;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
                  Your Original Message
                </td>
              </tr>
              <tr>
                <td style="padding:14px 16px;background:#f8fafc;color:#334155;font-size:13px;line-height:1.75;">
                  ${nlToBr(params.originalMessage)}
                </td>
              </tr>
            </table>
            <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#334155;">Best regards,<br/><strong>${safeFrom}</strong></p>
          </td>
        </tr>
      </table>
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
