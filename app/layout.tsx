import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1a2e',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lakeridepros.com'),
  title: "Lake Ride Pros | Luxury Transportation at Lake of the Ozarks",
  description: "Premium luxury transportation at Lake of the Ozarks, Missouri. Professional drivers, 24/7 service, luxury vehicles for all occasions. Book your ride today!",
  keywords: ["luxury transportation", "Lake of the Ozarks", "Missouri", "limousine service", "airport transfer", "charter service"],
  openGraph: {
    title: "Lake Ride Pros - Premium Luxury Transportation",
    description: "Experience premium luxury transportation services at Lake of the Ozarks, Missouri.",
    type: "website",
    locale: "en_US",
    siteName: "Lake Ride Pros",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake Ride Pros - Luxury Transportation at Lake of the Ozarks',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lake Ride Pros - Premium Luxury Transportation",
    description: "Experience premium luxury transportation services at Lake of the Ozarks, Missouri.",
    images: ['/og-image.jpg'],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}