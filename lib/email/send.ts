import { getEmailProvider } from "./registry";
import { formatPrice } from "@/lib/format";

function storeNotificationEmail(): string | null {
  return process.env.STORE_NOTIFICATION_EMAIL || null;
}

// Order confirmation and the store alert are best-effort: a failed email
// must never fail an already-placed order, so both catch and log internally
// rather than propagating. The contact form (sendContactFormEmail, below) is
// the opposite — its entire purpose is the email, so it lets the caller
// handle failure and tell the customer.
export async function sendOrderConfirmationEmail(params: { to: string; orderNumber: string; total: number }) {
  const { to, orderNumber, total } = params;
  try {
    await getEmailProvider().send({
      to,
      subject: `Order confirmed — ${orderNumber}`,
      html: `<p>Thanks for your order. Your order <strong>${orderNumber}</strong> is confirmed — total ${formatPrice(
        total
      )}, payable by Cash on Delivery when it arrives.</p>`,
      text: `Thanks for your order. Your order ${orderNumber} is confirmed — total ${formatPrice(
        total
      )}, payable by Cash on Delivery when it arrives.`
    });
  } catch (error) {
    console.error("sendOrderConfirmationEmail failed", error);
  }
}

export async function sendNewOrderAlertEmail(params: { orderNumber: string; total: number }) {
  const to = storeNotificationEmail();
  if (!to) return;
  const { orderNumber, total } = params;
  try {
    await getEmailProvider().send({
      to,
      subject: `New order — ${orderNumber}`,
      html: `<p>New order <strong>${orderNumber}</strong> placed — total ${formatPrice(total)}.</p>`,
      text: `New order ${orderNumber} placed — total ${formatPrice(total)}.`
    });
  } catch (error) {
    console.error("sendNewOrderAlertEmail failed", error);
  }
}

export async function sendShippingNotificationEmail(params: {
  to: string;
  orderNumber: string;
  trackingCarrier: string;
  trackingNumber: string;
  trackingUrl: string | null;
}) {
  const { to, orderNumber, trackingCarrier, trackingNumber, trackingUrl } = params;
  try {
    await getEmailProvider().send({
      to,
      subject: `Your order ${orderNumber} has shipped`,
      html: `<p>Your order <strong>${orderNumber}</strong> has shipped via ${trackingCarrier}, tracking number ${trackingNumber}.${
        trackingUrl ? ` <a href="${trackingUrl}">Track your package</a>.` : ""
      }</p>`,
      text: `Your order ${orderNumber} has shipped via ${trackingCarrier}, tracking number ${trackingNumber}.${
        trackingUrl ? ` Track: ${trackingUrl}` : ""
      }`
    });
  } catch (error) {
    console.error("sendShippingNotificationEmail failed", error);
  }
}

export async function sendContactFormEmail(params: { name: string; email: string; message: string }) {
  const to = storeNotificationEmail();
  if (!to) {
    throw new Error("STORE_NOTIFICATION_EMAIL is not configured.");
  }
  const { name, email, message } = params;
  await getEmailProvider().send({
    to,
    subject: `Contact form message from ${name}`,
    html: `<p>From: ${name} (${email})</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    text: `From: ${name} (${email})\n\n${message}`
  });
}
