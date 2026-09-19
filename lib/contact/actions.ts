"use server";

import { sendContactFormEmail } from "@/lib/email/send";

export interface ContactFormState {
  error: string | null;
  success: boolean;
}

// The contact form previously did nothing but flip local React state —
// every inquiry was discarded, with the customer shown a green "sent"
// confirmation regardless. This is the store's only stated support channel
// besides the phone number, so a silent failure here is a real support gap.
export async function submitContactForm(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email.includes("@") || !message) {
    return { error: "Please fill in your name, a valid email, and a message.", success: false };
  }

  try {
    await sendContactFormEmail({ name, email, message });
  } catch (error) {
    console.error("submitContactForm error", error);
    return { error: "Could not send your message right now. Please try again or call us directly.", success: false };
  }

  return { error: null, success: true };
}
