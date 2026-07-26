import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/content/ru";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand} — ${site.tagline}`,
  description: site.hero.subtitle,
  openGraph: {
    title: `${site.brand} — ${site.tagline}`,
    description: site.hero.subtitle,
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-bg font-sans text-fg">
        <SmoothScroll>
          <Header />
          <main className="relative z-[2]">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
