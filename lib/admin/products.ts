"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_BADGES = ["new", "limited", "sale"] as const;
type Badge = (typeof VALID_BADGES)[number];
const VALID_AVAILABILITY = ["in_stock", "low_stock", "out_of_stock"] as const;
const VALID_IMAGE_ROLES = ["primary", "secondary", "gallery"] as const;
type ImageRole = (typeof VALID_IMAGE_ROLES)[number];
const VALID_ASPECT_RATIOS = ["4:5", "3:4", "1:1", "16:9", "21:9", "hero"] as const;

// ---------- Products ----------

export interface ProductFormState {
  error: string | null;
}

function readProductFields(formData: FormData) {
  const badges = formData
    .getAll("badges")
    .map(String)
    .filter((b): b is Badge => (VALID_BADGES as readonly string[]).includes(b));
  const availabilityRaw = String(formData.get("availability") || "in_stock");
  const availability = (VALID_AVAILABILITY as readonly string[]).includes(availabilityRaw) ? availabilityRaw : "in_stock";

  return {
    slug: String(formData.get("slug") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    price: Number(formData.get("price")),
    compareAtPrice: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : null,
    description: String(formData.get("description") || "").trim(),
    availability,
    badges,
    material: String(formData.get("material") || "").trim(),
    fit: String(formData.get("fit") || "").trim(),
    care: String(formData.get("care") || "").trim(),
    // Admin-set for now — a deliberate stand-in until a real review system
    // computes rating/reviewCount from actual customer reviews.
    rating: Number(formData.get("rating") || 0),
    reviewCount: Number(formData.get("reviewCount") || 0)
  };
}

function validateProductFields(fields: ReturnType<typeof readProductFields>): string | null {
  if (!fields.slug || !fields.name) return "Slug and name are required.";
  if (!Number.isFinite(fields.price) || fields.price < 0) return "Price must be zero or more.";
  if (fields.compareAtPrice !== null && (!Number.isFinite(fields.compareAtPrice) || fields.compareAtPrice < 0)) {
    return "Compare-at price must be zero or more.";
  }
  if (fields.rating < 0 || fields.rating > 5) return "Rating must be between 0 and 5.";
  if (fields.reviewCount < 0) return "Review count must be zero or more.";
  return null;
}

export async function createProduct(_prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const fields = readProductFields(formData);
  const validationError = validateProductFields(fields);
  if (validationError) return { error: validationError };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .insert({
      slug: fields.slug,
      name: fields.name,
      price: fields.price,
      compare_at_price: fields.compareAtPrice,
      description: fields.description,
      availability: fields.availability,
      badges: fields.badges,
      material: fields.material,
      fit: fields.fit,
      care: fields.care,
      rating: fields.rating,
      review_count: fields.reviewCount
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createProduct error", error);
    return { error: error?.code === "23505" ? "That slug is already in use." : "Could not create product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect(`/admin/products/${data.id}`);
}

export async function updateProduct(_prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const fields = readProductFields(formData);
  const validationError = validateProductFields(fields);
  if (!id) return { error: "Missing product id." };
  if (validationError) return { error: validationError };

  const admin = createAdminClient();
  const { data: current } = await admin.from("products").select("slug").eq("id", id).single();

  const { error } = await admin
    .from("products")
    .update({
      slug: fields.slug,
      name: fields.name,
      price: fields.price,
      compare_at_price: fields.compareAtPrice,
      description: fields.description,
      availability: fields.availability,
      badges: fields.badges,
      material: fields.material,
      fit: fields.fit,
      care: fields.care,
      rating: fields.rating,
      review_count: fields.reviewCount
    })
    .eq("id", id);

  if (error) {
    console.error("updateProduct error", error);
    return { error: error.code === "23505" ? "That slug is already in use." : "Could not update product." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  if (current?.slug) revalidatePath(`/product/${current.slug}`);
  revalidatePath(`/product/${fields.slug}`);
  return { error: null };
}

// Only one product can be the homepage hero at a time (enforced by
// products_is_hero_unique) — unset whichever one currently holds it before
// setting the new one, same two-sequential-writes shape as
// lib/account/actions.ts's setDefaultAddress.
export async function setHeroProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  const admin = createAdminClient();
  const { error: unsetError } = await admin.from("products").update({ is_hero: false }).eq("is_hero", true);
  if (unsetError) console.error("setHeroProduct unset error", unsetError);
  const { error: setError } = await admin.from("products").update({ is_hero: true }).eq("id", id);
  if (setError) console.error("setHeroProduct set error", setError);

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  const admin = createAdminClient();

  // on delete cascade clears product_images/product_variants rows, but
  // storage objects aren't cascaded — remove them explicitly first or the
  // bucket accumulates orphans.
  const { data: images } = await admin.from("product_images").select("storage_path").eq("product_id", id);
  if (images && images.length > 0) {
    const { error: removeError } = await admin.storage.from("product-images").remove(images.map((i) => i.storage_path));
    if (removeError) console.error("deleteProduct storage remove error", removeError);
  }

  const { error: deleteError } = await admin.from("products").delete().eq("id", id);
  if (deleteError) console.error("deleteProduct error", deleteError);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

// ---------- Product images ----------

export interface ImageActionState {
  error: string | null;
}

function extensionFromFile(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length > 0 && fromName.length <= 5) return fromName.toLowerCase();
  const fromType = file.type.split("/").pop();
  return fromType || "jpg";
}

export async function upsertProductImage(_prevState: ImageActionState, formData: FormData): Promise<ImageActionState> {
  await requireAdmin();

  const productId = Number(formData.get("productId"));
  const slug = String(formData.get("slug") || "").trim();
  const roleRaw = String(formData.get("role") || "");
  const role = (VALID_IMAGE_ROLES as readonly string[]).includes(roleRaw) ? (roleRaw as ImageRole) : null;
  const alt = String(formData.get("alt") || "").trim();
  const aspectRatioRaw = String(formData.get("aspectRatio") || "4:5");
  const aspectRatio = (VALID_ASPECT_RATIOS as readonly string[]).includes(aspectRatioRaw) ? aspectRatioRaw : "4:5";
  const file = formData.get("image");

  if (!productId || !role) return { error: "Missing product or image role." };
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file to upload." };

  const admin = createAdminClient();
  const path = `${slug || productId}/${role}-${Date.now()}.${extensionFromFile(file)}`;

  const { error: uploadErr } = await admin.storage.from("product-images").upload(path, file, {
    contentType: file.type || undefined
  });
  if (uploadErr) {
    console.error("upsertProductImage upload error", uploadErr);
    return { error: "Could not upload image." };
  }

  if (role === "primary" || role === "secondary") {
    // product_images_primary_unique / ..._secondary_unique are partial
    // unique indexes (one per product) — replacing is an update, not an
    // insert, with the old storage object explicitly removed.
    const { data: existing } = await admin
      .from("product_images")
      .select("id, storage_path")
      .eq("product_id", productId)
      .eq("role", role)
      .maybeSingle();

    if (existing) {
      await admin.storage.from("product-images").remove([existing.storage_path]);
      const { error } = await admin
        .from("product_images")
        .update({ storage_path: path, alt, aspect_ratio: aspectRatio })
        .eq("id", existing.id);
      if (error) {
        console.error("upsertProductImage update error", error);
        return { error: "Could not save image." };
      }
    } else {
      const { error } = await admin
        .from("product_images")
        .insert({ product_id: productId, role, sort_order: 0, storage_path: path, alt, aspect_ratio: aspectRatio });
      if (error) {
        console.error("upsertProductImage insert error", error);
        return { error: "Could not save image." };
      }
    }
  } else {
    const { data: lastGallery } = await admin
      .from("product_images")
      .select("sort_order")
      .eq("product_id", productId)
      .eq("role", "gallery")
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextSortOrder = (lastGallery?.[0]?.sort_order ?? -1) + 1;

    const { error } = await admin
      .from("product_images")
      .insert({ product_id: productId, role: "gallery", sort_order: nextSortOrder, storage_path: path, alt, aspect_ratio: aspectRatio });
    if (error) {
      console.error("upsertProductImage gallery insert error", error);
      return { error: "Could not save image." };
    }
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
  return { error: null };
}

export async function deleteProductImage(formData: FormData) {
  await requireAdmin();
  const imageId = Number(formData.get("imageId"));
  const productId = Number(formData.get("productId"));
  if (!imageId) return;

  const admin = createAdminClient();
  const { data: image } = await admin.from("product_images").select("storage_path").eq("id", imageId).maybeSingle();
  if (image) {
    const { error: removeError } = await admin.storage.from("product-images").remove([image.storage_path]);
    if (removeError) console.error("deleteProductImage storage remove error", removeError);
    const { error: deleteError } = await admin.from("product_images").delete().eq("id", imageId);
    if (deleteError) console.error("deleteProductImage error", deleteError);
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}

// ---------- Variants ----------

export interface VariantActionState {
  error: string | null;
}

export async function createVariant(_prevState: VariantActionState, formData: FormData): Promise<VariantActionState> {
  await requireAdmin();
  const productId = Number(formData.get("productId"));
  const size = String(formData.get("size") || "").trim();
  const stockQty = Number(formData.get("stockQty") || 0);
  const available = formData.get("available") === "on";

  if (!productId || !size) {
    return { error: "Size is required." };
  }
  if (!Number.isFinite(stockQty) || stockQty < 0) {
    return { error: "Stock quantity must be zero or more." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("product_variants").insert({ product_id: productId, size, stock_qty: stockQty, available });

  if (error) {
    console.error("createVariant error", error);
    return { error: error.code === "23505" ? "That size already exists." : "Could not add variant." };
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
  return { error: null };
}

export async function updateVariant(_prevState: VariantActionState, formData: FormData): Promise<VariantActionState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const productId = Number(formData.get("productId"));
  const stockQty = Number(formData.get("stockQty") || 0);
  const available = formData.get("available") === "on";

  if (!id || !Number.isFinite(stockQty) || stockQty < 0) {
    return { error: "Invalid variant update." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("product_variants").update({ stock_qty: stockQty, available }).eq("id", id);
  if (error) {
    console.error("updateVariant error", error);
    return { error: "Could not update variant." };
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
  return { error: null };
}

export async function deleteVariant(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const productId = Number(formData.get("productId"));
  if (!id) return;

  const admin = createAdminClient();
  const { error } = await admin.from("product_variants").delete().eq("id", id);
  if (error) console.error("deleteVariant error", error);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop");
}
