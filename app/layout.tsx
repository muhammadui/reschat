import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saje Restaurant",
  description: "Chatbot for Saje Restaurant",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Saje Restaurant",
    description: "Chatbot for Saje Restaurant",
    url: "https://saje-restaurant.vercel.app",
    siteName: "Saje Restaurant",
    images: [
      {
        url: "https://saje-restaurant.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Saje Restaurant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saje Restaurant",
    description: "Chatbot for Saje Restaurant",
    images: ["https://saje-restaurant.vercel.app/og-image.png"],
    creator: "@saje_restaurant",
  },
  themeColor: "#ffffff",
  appleWebApp: {
    title: "Saje Restaurant",
    statusBarStyle: "default",
    capable: true,
    startupImage: [
      "/apple-touch-icon.png",
      "/apple-touch-icon-120x120.png",
      "/apple-touch-icon-152x152.png",
      "/apple-touch-icon-167x167.png",
      "/apple-touch-icon-180x180.png",
    ],
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://saje-restaurant.vercel.app",
    languages: {
      "en-US": "https://saje-restaurant.vercel.app",
      "fr-FR": "https://saje-restaurant.vercel.app/fr",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
