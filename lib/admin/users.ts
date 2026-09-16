"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function toggleAdmin(formData: FormData) {
  const currentAdmin = await requireAdmin();
  const userId = String(formData.get("userId") || "");
  const makeAdmin = formData.get("makeAdmin") === "true";
  if (!userId) return;

  // An admin can't demote themselves — otherwise a lone admin could lock
  // everyone (including themselves) out of the panel with no SQL fallback.
  if (!makeAdmin && userId === currentAdmin.userId) return;

  const admin = createAdminClient();
  await admin.from("profiles").update({ is_admin: makeAdmin }).eq("id", userId);

  revalidatePath("/admin/users");
}
