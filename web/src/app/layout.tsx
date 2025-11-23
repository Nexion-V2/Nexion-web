import RegisterServiceWorker from "@/components/core/RegisterServiceWorker";
import { metadata, viewport } from "@/components/core/metadata";
// import AppProtection from "@/components/core/AppProtection";
// import RouteGuard from "@/components/core/RouteGuard";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/app/Providers";
import React from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { metadata };
export { viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* webcrx="" error showing from extension */}
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nexion" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <RegisterServiceWorker />
        {/* <AppProtection /> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
