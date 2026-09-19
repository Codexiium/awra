import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminIndexPage() {
  await requireAdmin();
  redirect("/admin/orders");
}
