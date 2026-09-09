import { WebsiteAnalytics } from "@/components/WebsiteAnalytics";
import { Suspense } from "react";
import { BookingAttributionCapture } from "@/components/BookingAttributionCapture";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SiteAnnouncement from "@/components/announcements/SiteAnnouncement";
import { PhoneModal } from "@/components/PhoneModal";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-main-app>
      <WebsiteAnalytics />
      <Suspense fallback={null}><BookingAttributionCapture /></Suspense>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
        themes={['dark']}
      >
        <CartProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <SiteAnnouncement />
          <Header />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <PhoneModal />
        </CartProvider>
      </ThemeProvider>
    </div>
  );
}
