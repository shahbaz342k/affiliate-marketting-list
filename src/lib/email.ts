import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const transporter = smtpHost
  ? nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    })
  : null;

export async function sendAccountEmail({
  to,
  subject,
  url,
}: {
  to: string;
  subject: string;
  url: string;
}) {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP_HOST must be configured to send account emails.");
    }
    console.info(`[account email] ${subject} for ${to}: ${url}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text: `Open this link to continue: ${url}`,
  });
}