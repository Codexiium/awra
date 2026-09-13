"use client";

import { useState } from "react";
import Image from "next/image";
import type { AspectRatio } from "@/app/types";

type ImageLoadState = "loading" | "loaded" | "placeholder";

interface ProductImageProps {
  src?: string | null;
  alt?: string;
  aspectRatio?: AspectRatio;
  className?: string;
  priority?: boolean;
  gothicSymbol?: string;
}

const aspectClassMap: Record<AspectRatio, string> = {
  "4:5": "aspect-[4/5]",
  "3:4": "aspect-[3/4]",
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "21:9": "aspect-[21/9]",
  hero: "aspect-[16/9] lg:aspect-[21/9]"
};

export default function ProductImage({
  src = null,
  alt = "ARWA Fashion Product",
  aspectRatio = "4:5",
  className = "",
  priority = false,
  gothicSymbol = "✦"
}: ProductImageProps) {
  const [imageState, setImageState] = useState<ImageLoadState>(src ? "loading" : "placeholder");

  const selectedAspectClass = aspectClassMap[aspectRatio] || "aspect-[4/5]";

  if (!src || imageState === "placeholder") {
    return (
      <div
        className={`relative w-full ${selectedAspectClass} overflow-hidden bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#080808] border border-white/5 group ${className}`}
        role="img"
        aria-label={`Product preview placeholder - ${alt}`}
      >
        {/* Fine Noise Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

        {/* Center Gothic Emblem Glyph */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 select-none">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.06] mb-2 group-hover:border-white/20 transition-all duration-500">
            <span className="text-2xl text-zinc-500/60 font-gothic group-hover:text-zinc-300/80 transition-colors duration-500">
              {gothicSymbol}
            </span>
            <div className="absolute inset-0 rounded-full border border-zinc-700/20 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
            ARWA ARCHIVE
          </span>
        </div>

        {/* Subdued Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${selectedAspectClass} overflow-hidden bg-[#0d0d0d] ${className}`}>
      {imageState === "loading" && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        onLoad={() => setImageState("loaded")}
        onError={() => setImageState("placeholder")}
        className={`object-cover object-center transition-all duration-700 ${
          imageState === "loaded" ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      />
    </div>
  );
}
