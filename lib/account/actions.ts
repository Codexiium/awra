"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) throw new Error("Not authenticated");
  return { supabase, userId: auth.claims.sub as string };
}

// ---------- Addresses ----------

export interface AddressActionState {
  error: string | null;
  success: boolean;
}

function readAddressFields(formData: FormData) {
  return {
    label: String(formData.get("label") || "Home").trim(),
    street: String(formData.get("street") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    state: String(formData.get("state") || "").trim(),
    postalCode: String(formData.get("postalCode") || "").trim(),
    country: String(formData.get("country") || "").trim(),
    isDefault: formData.get("isDefault") === "on"
  };
}

export async function createAddress(_prevState: AddressActionState, formData: FormData): Promise<AddressActionState> {
  const { supabase, userId } = await requireUser();
  const fields = readAddressFields(formData);

  if (!fields.street || !fields.city || !fields.postalCode || !fields.country) {
    return { error: "Please fill in all required address fields.", success: false };
  }

  if (fields.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId).eq("is_default", true);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: userId,
    label: fields.label,
    street: fields.street,
    city: fields.city,
    state: fields.state,
    postal_code: fields.postalCode,
    country: fields.country,
    is_default: fields.isDefault
  });
  if (error) return { error: "Could not save address. Please try again.", success: false };

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { error: null, success: true };
}

export async function updateAddress(_prevState: AddressActionState, formData: FormData): Promise<AddressActionState> {
  const { supabase, userId } = await requireUser();
  const id = Number(formData.get("id"));
  const fields = readAddressFields(formData);

  if (!id || !fields.street || !fields.city || !fields.postalCode || !fields.country) {
    return { error: "Please fill in all required address fields.", success: false };
  }

  if (fields.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId).eq("is_default", true);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      label: fields.label,
      street: fields.street,
      city: fields.city,
      state: fields.state,
      postal_code: fields.postalCode,
      country: fields.country,
      is_default: fields.isDefault
    })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { error: "Could not update address. Please try again.", success: false };

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { error: null, success: true };
}

export async function deleteAddress(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const id = Number(formData.get("id"));
  if (!id) return;

  await supabase.from("addresses").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}

export async function setDefaultAddress(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const id = Number(formData.get("id"));
  if (!id) return;

  await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId).eq("is_default", true);
  await supabase.from("addresses").update({ is_default: true }).eq("id", id).eq("user_id", userId);
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}

// ---------- Profile settings ----------

export interface UpdateProfileState {
  error: string | null;
  message: string | null;
}

export async function updateProfile(_prevState: UpdateProfileState, formData: FormData): Promise<UpdateProfileState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { error: "Not authenticated", message: null };

  const fullName = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();

  const { error: profileErr } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone })
    .eq("id", auth.claims.sub);
  if (profileErr) return { error: "Could not save settings. Please try again.", message: null };

  let message = "Settings saved.";
  if (email && email !== auth.claims.email) {
    const { error: emailErr } = await supabase.auth.updateUser({ email });
    if (emailErr) return { error: emailErr.message, message: null };
    message = "Settings saved. Check your inbox to confirm your new email address.";
  }

  revalidatePath("/account/settings");
  revalidatePath("/account");
  return { error: null, message };
}
