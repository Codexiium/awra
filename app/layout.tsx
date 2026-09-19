import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/layout/CartDrawer";
import SearchOverlay from "./components/layout/SearchOverlay";
import Toast from "./components/ui/Toast";
import CartWishlistSync from "./components/CartWishlistSync";
import { getAllProductsForNav } from "@/lib/catalog";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// This app-wide default is what every route shows until it sets its own
// metadata/generateMetadata — see app/product/[slug]/page.tsx and the static
// `metadata` exports on /shop, /about, /contact, and the policy pages for
// the per-page overrides.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "ARWA — Dark Gothic Streetwear",
    template: "%s | ARWA"
  },
  description: "Oversized cotton printed gothic streetwear tees, Cash on Delivery across India.",
  keywords: ["ARWA", "Dark Streetwear", "Gothic Fashion", "Oversized T-Shirts", "Cotton Printed Tees"],
  openGraph: {
    title: "ARWA — Dark Gothic Streetwear",
    description: "Oversized cotton printed gothic streetwear tees, Cash on Delivery across India.",
    images: ["/logo.png"]
  }
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const navProducts = await getAllProductsForNav();

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080808] text-[#f5f5f5] font-sans selection:bg-zinc-700 selection:text-white">
        {/* Global Announcement Alert Bar */}
        <AnnouncementBar />

        {/* Global Header Navigation */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 w-full">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Global Overlay Components */}
        <CartDrawer />
        <SearchOverlay products={navProducts} />
        <Toast />
        <CartWishlistSync />
      </body>
    </html>
  );
}
