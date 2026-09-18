// Shared domain types for the ARWA storefront.
// Centralized here so mock data, Zustand stores, and components all agree on shape.

export type AspectRatio = "4:5" | "3:4" | "1:1" | "16:9" | "21:9" | "hero";

export interface ProductImageAsset {
  src: string | null;
  alt: string;
  aspectRatio: AspectRatio;
}

export interface ProductImages {
  primary: ProductImageAsset;
  secondary: ProductImageAsset;
  gallery: ProductImageAsset[];
}

export interface ProductSizeOption {
  size: string;
  available: boolean;
}

export type ProductBadge = "new" | "limited" | "sale";

export type ProductAvailability = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductDetails {
  material: string;
  fit: string;
  care: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: ProductImages;
  sizes: ProductSizeOption[];
  availability: ProductAvailability;
  badges: ProductBadge[];
  rating: number;
  reviewCount: number;
  details: ProductDetails;
}

// Cart

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface PromoResult {
  success: boolean;
  message: string;
}

// Auth / Account

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  name: string;
  size: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  tier: string;
  shippingAddress: ShippingAddress;
  orders: Order[];
}
