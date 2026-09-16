"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: number;
  variantId?: number | null;
  nama: string;
  slug: string;
  warna: string;
  ukuran: string;
  harga: number;
  gambarUrl: string;
  qty: number;
  sku?: string;
  bahan?: string;
}

export interface CouponData {
  kode: string;
  diskon: number;
  minimalOrder: number;
  tipe: string;
  nilai: number;
}

export interface AddressData {
  nama: string;
  nomorWa: string;
  jalan: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  catatan?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeFromCart: (productId: number, warna?: string, ukuran?: string) => void;
  updateQty: (productId: number, warna: string, ukuran: string, newQty: number) => void;
  clearCart: () => void;
  appliedCoupon: CouponData | null;
  applyCoupon: (coupon: CouponData | null) => void;
  shippingCost: number;
  setShippingCost: (cost: number) => void;
  selectedCourier: string;
  setSelectedCourier: (courier: string) => void;
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  shippingAddress: AddressData;
  setShippingAddress: (addr: AddressData) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const defaultAddress: AddressData = {
  nama: "Aisyah Nurul",
  nomorWa: "082198765432",
  jalan: "Jl. Mawar Mekar No. 12, Kebayoran Baru",
  kota: "Jakarta Selatan",
  provinsi: "DKI Jakarta",
  kodePos: "12310",
  catatan: "Harap dibungkus rapi dengan pita",
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(15000);
  const [selectedCourier, setSelectedCourier] = useState<string>("SiCepat REG (1-2 Hari)");
  const [shippingAddress, setShippingAddress] = useState<AddressData>(defaultAddress);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("naqi_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Sample default cart item for demo convenience
        setCart([
          {
            productId: 1,
            variantId: 1,
            nama: "Abaya Premium Silk Naqi",
            slug: "abaya-premium-silk-naqi",
            warna: "Hijau Zamrud",
            ukuran: "M",
            harga: 299000,
            gambarUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
            qty: 1,
            sku: "NQ-1-HIJAU-M",
            bahan: "Armani Silk Grade A"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("naqi_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (newItem: Omit<CartItem, "qty">, qtyToAdd = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.warna === newItem.warna &&
          i.ukuran === newItem.ukuran
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].qty += qtyToAdd;
        return updated;
      } else {
        return [...prev, { ...newItem, qty: qtyToAdd }];
      }
    });

    showToast(`✓ "${newItem.nama}" (${newItem.warna}, ${newItem.ukuran}) masuk keranjang!`);
  };

  const removeFromCart = (productId: number, warna?: string, ukuran?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.productId === productId &&
            (!warna || i.warna === warna) &&
            (!ukuran || i.ukuran === ukuran)
          )
      )
    );
    showToast("Produk telah dihapus dari keranjang.");
  };

  const updateQty = (productId: number, warna: string, ukuran: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, warna, ukuran);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.warna === warna && i.ukuran === ukuran
          ? { ...i, qty: newQty }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: CouponData | null) => {
    setAppliedCoupon(coupon);
    if (coupon) {
      showToast(`Voucher ${coupon.kode} berhasil dipasang! Hemat Rp ${coupon.diskon.toLocaleString("id-ID")}`);
    } else {
      showToast("Voucher dilepas.");
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.harga * item.qty, 0);
  const totalDiscount = appliedCoupon ? appliedCoupon.diskon : 0;
  const grandTotal = Math.max(0, subtotal - totalDiscount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        appliedCoupon,
        applyCoupon,
        shippingCost,
        setShippingCost,
        selectedCourier,
        setSelectedCourier,
        subtotal,
        totalDiscount,
        grandTotal,
        shippingAddress,
        setShippingAddress,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
