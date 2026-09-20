import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { setHeroProduct } from "@/lib/admin/products";
import { formatPrice } from "@/lib/format";
import { getPublicImageUrl } from "@/lib/storage";
import { parsePage, Pager } from "@/lib/admin/pagination";

interface ProductImageRow {
  role: string;
  storage_path: string;
}
interface ProductVariantRow {
  stock_qty: number;
}

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  await requireAdmin();
  const sp = await props.searchParams;
  const { page, from, to } = parsePage(sp);

  const admin = createAdminClient();
  const {
    data: products,
    count,
    error
  } = await admin
    .from("products")
    .select(
      "id, slug, name, price, compare_at_price, availability, is_hero, product_images(role, storage_path), product_variants(stock_qty)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-200 font-bold">
          ALL PRODUCTS ({count ?? 0})
        </h2>
        <Link
          href="/admin/products/new"
          className="clay-button-primary px-4 py-2 text-xs font-mono uppercase flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> ADD PRODUCT
        </Link>
      </div>

      {error && (
        <p className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-2">
          Could not load products.
        </p>
      )}

      {products && products.length > 0 ? (
        <div className="space-y-3 font-mono text-xs">
          {products.map((p) => {
            const images = p.product_images as ProductImageRow[];
            const variants = p.product_variants as ProductVariantRow[];
            const primary = images.find((i) => i.role === "primary");
            const totalStock = variants.reduce((sum, v) => sum + v.stock_qty, 0);

            return (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4 bg-[#0f0f0f] border border-white/10 hover:border-white/30 transition-colors"
              >
                <Link href={`/admin/products/${p.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-[#181818] border border-white/10 shrink-0 overflow-hidden">
                    {primary && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getPublicImageUrl(primary.storage_path)} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-bold flex items-center gap-1.5 truncate">
                      {p.name}
                      {p.is_hero && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {p.slug} · {variants.length} VARIANT(S) · {totalStock} IN STOCK
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-white font-bold block">{formatPrice(p.price)}</span>
                    {p.compare_at_price != null && (
                      <span className="text-[10px] text-zinc-500 line-through">{formatPrice(p.compare_at_price)}</span>
                    )}
                  </div>
                </Link>

                <form action={setHeroProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    disabled={p.is_hero}
                    className={`clay-button-secondary px-3 py-1.5 text-[10px] uppercase whitespace-nowrap disabled:opacity-60 ${
                      p.is_hero ? "border-amber-500/40 text-amber-300" : ""
                    }`}
                  >
                    {p.is_hero ? "HOMEPAGE HERO" : "SET AS HERO"}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs font-mono text-zinc-500 py-12 text-center">No products yet.</p>
      )}

      <Pager page={page} total={count ?? 0} basePath="/admin/products" />
    </div>
  );
}
