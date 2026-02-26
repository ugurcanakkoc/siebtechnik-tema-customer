import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { I18nProvider } from "@/lib/i18n";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UVP Schaltschrankbau | Digitaler Zwilling & KI-Engineering",
  description: "Intelligente Lösungen im industriellen Schaltschrankbau mit KI-gestützten Technologien für Digitale Zwillinge.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col antialiased selection:bg-blue-500/20`}>
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          type="module"
          strategy="afterInteractive"
        />
        <I18nProvider>
          <div className="technical-bg" />
          <CustomCursor />
          <Header />
          <main className="flex-grow relative">
            {children}
          </main>
          <Footer />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
