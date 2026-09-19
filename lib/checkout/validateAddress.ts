// Single source of truth for checkout field requirements, imported by both
// the client form (for inline UX errors) and the server action (for actual
// enforcement) — previously these two checks were written independently and
// had drifted (the server never required lastName or country even though the
// client did), so a request that skipped the browser entirely could create
// an order with no last name and no country.
export interface CheckoutFormFields {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutFormFields, string>>;

export function validateCheckoutFields(fields: CheckoutFormFields): CheckoutFieldErrors {
  const errs: CheckoutFieldErrors = {};
  if (!fields.email.includes("@")) errs.email = "Valid email is required";
  if (!fields.firstName.trim()) errs.firstName = "First name is required";
  if (!fields.lastName.trim()) errs.lastName = "Last name is required";
  if (!fields.address.trim()) errs.address = "Shipping address is required";
  if (!fields.city.trim()) errs.city = "City is required";
  if (!fields.postalCode.trim()) errs.postalCode = "Postal code is required";
  if (!fields.country.trim()) errs.country = "Country is required";
  if (!fields.phone.trim()) errs.phone = "Phone number is required for delivery";
  return errs;
}
