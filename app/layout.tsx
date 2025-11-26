import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const themeInitScript = `
    (function() {
      var storageKey = 'akilli-ticaret:theme';
      var classList = document.documentElement.classList;
      var stored = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch (err) {}
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
      classList.remove('light','dark');
      classList.add(theme);
      document.documentElement.style.colorScheme = theme;
    })();
  `;

  return (
    <html lang="tr">
      <Script id="theme-init" strategy="beforeInteractive">
        {themeInitScript}
      </Script>
      <body className={`${inter.variable} ${inter.className} bg-surface text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100`}>
        <Providers>
          <div className="min-h-screen bg-surface transition-colors dark:bg-slate-950">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
                <Link href="/" className="text-lg font-black tracking-tight">
                  Akıllı Ticaret
                </Link>
                <div className="flex items-center gap-4">
                  <nav className="flex gap-3 text-sm font-semibold text-slate-600 dark:text-slate-100">
                    <Link
                      href="/products"
                      className="rounded-full px-4 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Ürünler
                    </Link>
                    <Link
                      href="/favorites"
                      className="rounded-full px-4 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Favoriler
                    </Link>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8 transition-colors">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
