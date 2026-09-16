"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const adminWa = "6281234567890";
  const defaultText = encodeURIComponent("Assalamu'alaikum Admin NAQI WEAR, saya mau tanya seputar produk syar'i.");

  return (
    <a
      href={`https://wa.me/${adminWa}?text=${defaultText}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 border-2 border-emerald-300"
      aria-label="Chat WhatsApp Admin"
    >
      <MessageCircle className="w-6 h-6 text-amber-200 fill-current" />
      <span className="hidden sm:inline text-sm">Chat CS NAQI</span>
    </a>
  );
}
