"use client";

import React, { useState } from "react";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  driveFileId?: string;
  loading?: "lazy" | "eager";
  fill?: boolean;
}

export default function ImageLoader({
  src,
  alt,
  className = "",
  driveFileId,
  loading = "lazy",
}: ImageLoaderProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If driveFileId is provided, construct direct Drive export URL as requested in prompt!
  let imageUrl = src;
  if (driveFileId) {
    imageUrl = `https://drive.google.com/uc?export=view&id=${driveFileId}`;
  } else if (src && src.includes("drive.google.com/file/d/")) {
    const match = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      imageUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }

  const fallbackUrl = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800";

  return (
    <div className={`relative overflow-hidden bg-emerald-50/40 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-shimmer bg-slate-200 z-10" />
      )}
      <img
        src={hasError ? fallbackUrl : imageUrl || fallbackUrl}
        alt={alt || "Gambar NAQI WEAR"}
        loading={loading}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
