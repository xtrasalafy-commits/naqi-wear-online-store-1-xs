"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function ToastNotification() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-[#1B4332] text-white p-4 rounded-xl shadow-2xl border border-[#D4AF37] flex items-center gap-3 animate-bounce-short transition-all">
      <div className="bg-[#D4AF37] text-[#1B4332] p-2 rounded-full shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1 text-sm font-medium text-[#FDF6E3]">
        {toastMessage}
      </div>
    </div>
  );
}
