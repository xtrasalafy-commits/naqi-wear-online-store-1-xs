"use client";

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-amber-100 shadow-sm animate-pulse flex flex-col space-y-3">
      <div className="w-full h-56 bg-stone-200 rounded-xl animate-shimmer" />
      <div className="h-4 bg-stone-200 rounded w-3/4" />
      <div className="h-3 bg-stone-200 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-stone-200 rounded w-24" />
        <div className="h-8 w-8 bg-stone-200 rounded-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
