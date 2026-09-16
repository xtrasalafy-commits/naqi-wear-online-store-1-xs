"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Tag, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Katalog", href: "/katalog", icon: Grid },
    { label: "Promo", href: "/promo", icon: Tag },
    { label: "Keranjang", href: "/keranjang", icon: ShoppingBag, badge: cartCount },
    { label: "Akun Saya", href: "/akun", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1B4332] border-t border-[#D4AF37]/30 text-white shadow-2xl px-2 py-1.5 flex justify-around items-center">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
              isActive ? "text-[#D4AF37] font-bold" : "text-stone-300 hover:text-white"
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-[#1B4332] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
