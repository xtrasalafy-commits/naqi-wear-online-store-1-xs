import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ToastNotification from "@/components/ToastNotification";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "NAQI WEAR - Toko Fashion Muslim Online Syar'i & Anggun",
  description:
    "Toko online pakaian muslim wanita, pria, anak, dan sarimbit keluarga yang sangat mudah dipahami, 100% syar'i, tidak menerawang, wudhu friendly, dan adem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 selection:bg-[#D4AF37] selection:text-[#1B4332]">
        <AuthProvider>
          <CartProvider>
            <Header />
            <ToastNotification />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
              {children}
            </main>
            <FloatingWhatsApp />
            <Footer />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
