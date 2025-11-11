import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lakeridepros.com'),
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
  verification: {
    // Add Google Search Console verification code here after setup
    // google: 'your-google-site-verification-code',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static.moovs.app" />

        {/* Moovs Booking FAB */}
        <Script
          id="moovs-fab"
          strategy="lazyOnload"
        >
          {`
            window["moovsAPI"] = moovsAPI = window["moovsAPI"] || [];
            moovsAPI.push(["operator", "49dfb7de-bbdf-11ee-a55e-57f07b7dc566"]);
            (function(m, oo, v, s) {
                s = m.createElement(oo);
                s.src = v;
                s.async = 1;
                m.head.appendChild(s);
            })(document, "script", "https://static.moovs.app");
          `}
        </Script>
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="min-h-screen">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
