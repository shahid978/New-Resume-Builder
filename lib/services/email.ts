import { env } from "@/lib/config/env";

/**
 * Transactional email via Resend.
 *
 * Used only for: verification, password reset, and subscription lifecycle
 * notices. Never sends resume text, job ads, or AI content. Sender is
 * verified before first send; deliverability is a launch gate.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Email send failed (${res.status}): ${body.slice(0, 200)}`
    );
  }
}

export async function sendVerificationEmail(params: {
  email: string;
  url: string;
  name?: string;
}) {
  const { email, url, name } = params;
  const greeting = name ? `Hi ${name},` : "Hi,";
  await sendEmail({
    to: email,
    subject: "Verify your Ascent account",
    html: `
      <body style="font-family: ui-sans-serif, system-ui, sans-serif; color: #201a15; max-width: 600px; margin: 0 auto; padding: 24px;">
        <p>${greeting}</p>
        <p>Confirm your email address to activate your Ascent account.</p>
        <p style="margin: 24px 0;">
          <a href="${url}" style="background: #b45309; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">Verify email</a>
        </p>
        <p style="color: #8a8375; font-size: 14px;">If you didn't create an account, you can ignore this email.</p>
      </body>
    `,
    text: `${greeting}\n\nConfirm your email address to activate your Ascent account.\n\n${url}\n\nIf you didn't create an account, you can ignore this email.`,
  });
}

export async function sendResetPasswordEmail(params: {
  email: string;
  url: string;
  name?: string;
}) {
  const { email, url, name } = params;
  const greeting = name ? `Hi ${name},` : "Hi,";
  await sendEmail({
    to: email,
    subject: "Reset your Ascent password",
    html: `
      <body style="font-family: ui-sans-serif, system-ui, sans-serif; color: #201a15; max-width: 600px; margin: 0 auto; padding: 24px;">
        <p>${greeting}</p>
        <p>Reset your password. This link expires in 24 hours.</p>
        <p style="margin: 24px 0;">
          <a href="${url}" style="background: #b45309; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">Reset password</a>
        </p>
        <p style="color: #8a8375; font-size: 14px;">If you didn't request a reset, you can ignore this email.</p>
      </body>
    `,
    text: `${greeting}\n\nReset your password. This link expires in 24 hours.\n\n${url}\n\nIf you didn't request a reset, you can ignore this email.`,
  });
}

export async function sendSubscriptionCanceledEmail(params: {
  email: string;
  name?: string;
  accessUntil: Date;
}) {
  const { email, name, accessUntil } = params;
  const greeting = name ? `Hi ${name},` : "Hi,";
  const until = accessUntil.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  await sendEmail({
    to: email,
    subject: "Your Pro plan is canceled",
    html: `
      <body style="font-family: ui-sans-serif, system-ui, sans-serif; color: #201a15; max-width: 600px; margin: 0 auto; padding: 24px;">
        <p>${greeting}</p>
        <p>You've canceled your Pro plan. Your access continues until <strong>${until}</strong>, after which you'll be on the free plan.</p>
      </body>
    `,
    text: `${greeting}\n\nYou've canceled your Pro plan. Your access continues until ${until}, after which you'll be on the free plan.`,
  });
}