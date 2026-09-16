"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: number;
  nama: string;
  email: string;
  nomorWa: string;
  gender: string;
  role: "customer" | "admin";
  avatarUrl: string;
  alamatJson?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  wishlistIds: number[];
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoCustomer: UserProfile = {
  id: 2,
  nama: "Aisyah Nurul",
  email: "aisyah@gmail.com",
  nomorWa: "082198765432",
  gender: "wanita",
  role: "customer",
  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
  alamatJson: {
    nama: "Aisyah Nurul",
    nomorWa: "082198765432",
    jalan: "Jl. Mawar Mekar No. 12",
    kota: "Jakarta Selatan",
    provinsi: "DKI Jakarta",
    kodePos: "12310"
  }
};

const demoAdmin: UserProfile = {
  id: 1,
  nama: "Admin NAQI WEAR",
  email: "admin@naqiwear.id",
  nomorWa: "081234567890",
  gender: "wanita",
  role: "admin",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(demoCustomer);
  const [wishlistIds, setWishlistIds] = useState<number[]>([1, 4, 7]);

  useEffect(() => {
    // Load initial wishlists
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlists?userId=2");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setWishlistIds(json.data.map((item: any) => item.id || item.productId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loginAsUser = () => {
    setUser(demoCustomer);
  };

  const loginAsAdmin = () => {
    setUser(demoAdmin);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleWishlist = async (productId: number) => {
    try {
      const res = await fetch("/api/wishlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id || 2, productId }),
      });
      const json = await res.json();

      if (json.action === "added") {
        setWishlistIds((prev) => [...prev, productId]);
      } else if (json.action === "removed") {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      }
    } catch (e) {
      console.error(e);
      // Optimistic fallback
      setWishlistIds((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistIds.includes(productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        loginAsUser,
        loginAsAdmin,
        logout,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
