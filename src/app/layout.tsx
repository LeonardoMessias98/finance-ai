import type { Metadata, Viewport } from "next";

import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

import "./globals.css";

export const metadata: Metadata = {
  title: "Finance AI",
  description: "Controle pessoal de finanças com visão mensal simples e objetiva.",
  applicationName: "Finance AI",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Finance AI"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
