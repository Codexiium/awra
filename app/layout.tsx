import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/layout/CartDrawer";
import SearchOverlay from "./components/layout/SearchOverlay";
import Toast from "./components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARWA — Premium Dark Gothic High-Fashion E-Commerce",
  description: "Official ARWA dark streetwear catalog featuring floor-length trenches, heavy distressed hoodies, spiky archival metal hardware, and cyber gothic silhouettes.",
  keywords: ["ARWA", "Dark Streetwear", "Gothic Fashion", "High-Fashion E-Commerce", "Nocturnal Disruption", "Sterling Silver"],
  openGraph: {
    title: "ARWA — Dark Gothic High-Fashion E-Commerce",
    description: "Architectural heavyweight silhouettes and archival silver hardware.",
    images: ["/Pasted image.png"]
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
        <SearchOverlay />
        <Toast />
      </body>
    </html>
  );
}
