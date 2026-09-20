"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { useCartStore } from "@/app/store/useCartStore";
import { useWishlistStore } from "@/app/store/useWishlistStore";
import { useUser } from "@/lib/supabase/useUser";
import { useSearchStore } from "@/app/store/useSearchStore";
import MobileNavDrawer from "./MobileNavDrawer";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { cart, openCart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const { isLoggedIn } = useUser();
  const { openSearch } = useSearchStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#080808]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3"
            : "bg-[#080808]/80 backdrop-blur-sm border-b border-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open mobile navigation menu"
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="relative flex items-center gap-3 group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-full border border-white/20 p-1 bg-black group-hover:border-white/50 transition-colors">
                <Image
                  src="/logo.png"
                  alt="ARWA Gothic Mark"
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <span className="font-gothic text-xl sm:text-2xl tracking-widest text-zinc-100 group-hover:text-white transition-colors">
                ARWA
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-zinc-300">
              <Link href="/shop" className="hover:text-white transition-colors">
                SHOP
              </Link>

              <Link href="/shop/new-arrivals" className="hover:text-white transition-colors">
                NEW ARRIVALS
              </Link>

              <Link href="/about" className="hover:text-white transition-colors">
                ABOUT
              </Link>
            </nav>
          </div>

          {/* Right Action Icons Cluster */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search items"
              className="p-2 text-zinc-300 hover:text-white transition-colors clay-button-secondary rounded-full"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="View Wishlist"
              className="relative p-2 text-zinc-300 hover:text-white transition-colors clay-button-secondary rounded-full"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              aria-label="Account Overview"
              className="p-2 text-zinc-300 hover:text-white transition-colors clay-button-secondary rounded-full"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="relative p-2 text-zinc-100 hover:text-white transition-colors clay-button-primary rounded-full flex items-center gap-1.5 px-3"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-mono font-bold hidden sm:inline">{totalCartCount}</span>
              {totalCartCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-4.5 h-4.5 bg-zinc-900 text-white border border-white/40 font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNavDrawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
