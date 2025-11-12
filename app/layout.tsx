import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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