import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { PhoneModal } from "@/components/PhoneModal";
import ParadeMusicBanner from "@/components/ParadeMusicBanner";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import FloatingCTA from "@/components/ui/FloatingCTA";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-main-app>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        disableTransitionOnChange={false}
        themes={['light', 'dark', 'high-contrast-light', 'high-contrast-dark']}
      >
        <CartProvider>
          <ScrollProgress />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <ParadeMusicBanner />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <PhoneModal />
          <BackToTop />
          <FloatingCTA />
        </CartProvider>
      </ThemeProvider>
    </div>
  );
}
