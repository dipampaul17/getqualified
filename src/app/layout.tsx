import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Qualify.ai - AI-Powered Lead Qualification",
  description: "Instantly qualify leads with AI and increase demo bookings by 40%",
  openGraph: {
    title: "Qualify.ai - AI-Powered Lead Qualification",
    description: "Instantly qualify leads with AI and increase demo bookings by 40%",
    url: "https://qualify.ai",
    siteName: "Qualify.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qualify.ai - AI-Powered Lead Qualification",
    description: "Instantly qualify leads with AI and increase demo bookings by 40%",
  },
  // Mobile app settings
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Qualify.ai",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // For iPhone X and newer
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.qualify.ai" crossOrigin="anonymous" />
        
        {/* Safari mobile specific fixes */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={cn(
        "min-h-screen bg-zinc-50 font-sans antialiased",
        // Prevent iOS bounce effect
        "overscroll-none",
        // Safe area for notched devices
        "env-safe",
        GeistSans.className
      )}>
        {children}
      </body>
    </html>
  );
}
