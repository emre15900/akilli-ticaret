import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Akıllı Ticaret | Ürün Kataloğu",
  description:
    "Next.js 14, Apollo Client ve Redux Toolkit ile hazırlanmış ürün keşif deneyimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${inter.className}`}>
        <Providers>
          <div className="min-h-screen bg-surface">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
                <Link href="/" className="text-lg font-black tracking-tight">
                  Akıllı Ticaret
                </Link>
                <nav className="flex gap-3 text-sm font-semibold text-slate-600">
                  <Link
                    href="/products"
                    className="rounded-full px-4 py-2 transition hover:bg-slate-100"
                  >
                    Ürünler
                  </Link>
                  <Link
                    href="/favorites"
                    className="rounded-full px-4 py-2 transition hover:bg-slate-100"
                  >
                    Favoriler
                  </Link>
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
