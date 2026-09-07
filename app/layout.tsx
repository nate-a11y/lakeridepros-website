import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { AIReferralTracker } from "@/components/AIReferralTracker";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: 'black',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lakeridepros.com'),
  title: "Lake Ride Pros | Missouri Transportation from Lake of the Ozarks",
  description: "Professional transportation based at Lake of the Ozarks and serving trips throughout Missouri, from private rides and airports to weddings, events, and groups.",
  keywords: ["luxury transportation", "Lake of the Ozarks", "Missouri", "limousine service", "airport transfer", "charter service"],
  openGraph: {
    title: "Lake Ride Pros - Professional Transportation Across Missouri",
    description: "Private rides, airport transfers, weddings, events, and group transportation from Lake of the Ozarks to destinations throughout Missouri.",
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
    title: "Lake Ride Pros - Professional Transportation Across Missouri",
    description: "Private rides, airport transfers, weddings, events, and group transportation from Lake of the Ozarks to destinations throughout Missouri.",
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
        {/* Root placement ensures every rendered page—not only the marketing
            route group—loads the same GTM container. */}
        <GoogleTagManager />
        <GoogleAnalytics />
        <AIReferralTracker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
