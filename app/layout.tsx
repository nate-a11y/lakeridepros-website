import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Lake Ride Pros - Premium Luxury Transportation at Lake of the Ozarks",
  description: "Experience premium luxury transportation services at Lake of the Ozarks, Missouri. Professional, reliable, and comfortable rides for all occasions.",
  keywords: ["luxury transportation", "Lake of the Ozarks", "Missouri", "limousine service", "airport transfer", "charter service"],
  openGraph: {
    title: "Lake Ride Pros - Premium Luxury Transportation",
    description: "Experience premium luxury transportation services at Lake of the Ozarks, Missouri.",
    type: "website",
    locale: "en_US",
    siteName: "Lake Ride Pros",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lake Ride Pros - Premium Luxury Transportation",
    description: "Experience premium luxury transportation services at Lake of the Ozarks, Missouri.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
