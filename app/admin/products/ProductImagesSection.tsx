"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { upsertProductImage, deleteProductImage, type ImageActionState } from "@/lib/admin/products";
import { getPublicImageUrl } from "@/lib/storage";

interface ImageRow {
  id: number;
  role: "primary" | "secondary" | "gallery";
  storage_path: string;
  alt: string;
}

interface ProductImagesSectionProps {
  productId: number;
  slug: string;
  images: ImageRow[];
}

const initialState: ImageActionState = { error: null };

function UploadSlot({ productId, slug, role, current }: { productId: number; slug: string; role: "primary" | "secondary" | "gallery"; current?: ImageRow }) {
  const [state, formAction, pending] = useActionState(upsertProductImage, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="alt" value={current?.alt ?? ""} />

      {current && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getPublicImageUrl(current.storage_path)}
          alt=""
          className="w-full aspect-[4/5] object-cover border border-white/10"
        />
      )}

      <input
        type="file"
        name="image"
        accept="image/*"
        className="block w-full text-[10px] text-zinc-400 file:mr-2 file:clay-button-secondary file:px-3 file:py-1.5 file:text-[10px] file:uppercase file:border-0"
      />

      {state.error && <p className="text-[10px] text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="clay-button-secondary w-full px-3 py-2 text-[10px] uppercase disabled:opacity-60"
      >
        {pending ? "UPLOADING..." : current ? "REPLACE" : "UPLOAD"}
      </button>
    </form>
  );
}

export default function ProductImagesSection({ productId, slug, images }: ProductImagesSectionProps) {
  const primary = images.find((i) => i.role === "primary");
  const secondary = images.find((i) => i.role === "secondary");
  const gallery = images.filter((i) => i.role === "gallery");

  return (
    <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-4 font-mono text-xs">
      <h3 className="uppercase tracking-widest text-zinc-400 font-bold border-b border-white/10 pb-2">IMAGES</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">PRIMARY (REQUIRED)</label>
          <UploadSlot productId={productId} slug={slug} role="primary" current={primary} />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 uppercase mb-1">SECONDARY (REQUIRED)</label>
          <UploadSlot productId={productId} slug={slug} role="secondary" current={secondary} />
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-zinc-400 uppercase mb-1">GALLERY (OPTIONAL)</label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {gallery.map((img) => (
            <div key={img.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPublicImageUrl(img.storage_path)}
                alt=""
                className="w-full aspect-[4/5] object-cover border border-white/10"
              />
              <form action={deleteProductImage}>
                <input type="hidden" name="imageId" value={img.id} />
                <input type="hidden" name="productId" value={productId} />
                <button
                  type="submit"
                  className="absolute top-1 right-1 p-1 bg-black/70 border border-red-500/40 text-red-400 hover:bg-red-950/80"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </form>
            </div>
          ))}
        </div>
        <UploadSlot productId={productId} slug={slug} role="gallery" />
      </div>
    </div>
  );
}
