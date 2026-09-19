import nodemailer from "nodemailer";
import type { EmailProvider, SendEmailInput } from "../types";

// Reuses the same SMTP credentials already configured for Supabase Auth
// (Project Settings -> Auth -> SMTP Settings) rather than adding a new email
// vendor for this first pass — Supabase itself doesn't expose a "send
// arbitrary email" REST endpoint (its SMTP config is wired internally to
// Auth emails only), so this app sends directly over SMTP with the same
// credentials via nodemailer. See TODO.md for the planned swap to Resend.
let cachedTransport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  if (cachedTransport) return cachedTransport;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !port || !user || !pass) {
    throw new Error(
      "Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD — copy the SMTP settings from the Supabase dashboard (Project Settings -> Auth -> SMTP Settings) into .env.local."
    );
  }

  cachedTransport = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass }
  });
  return cachedTransport;
}

export const supabaseSmtpProvider: EmailProvider = {
  key: "supabase-smtp",

  async send({ to, subject, html, text }: SendEmailInput): Promise<void> {
    const transport = getTransport();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
    await transport.sendMail({ from, to, subject, html, text });
  }
};
