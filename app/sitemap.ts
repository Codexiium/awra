import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/shop/new-arrivals",
  "/shop/best-sellers",
  "/about",
  "/contact",
  "/faq",
  "/lookbook",
  "/privacy-policy",
  "/terms-conditions",
  "/returns-exchange",
  "/shipping-delivery"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await getProducts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date()
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: new Date()
  }));

  return [...staticEntries, ...productEntries];
}
