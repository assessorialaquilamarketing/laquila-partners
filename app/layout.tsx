import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { MetaPixel } from "./components/MetaPixel";
import { GoogleTags } from "./components/GoogleTags";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fafaf9",
};

export const metadata: Metadata = {
  title: "Laquila Partners — Parceria de performance para escritórios trabalhistas e previdenciários",
  description:
    "Operação de marketing jurídico dedicada a advogados trabalhistas e previdenciários que já fecham contratos pelo digital. Modelo de comissão sobre contratos fechados. Vagas por aplicação.",
  openGraph: {
    title: "Laquila Partners — Parceria de performance, não agência.",
    description:
      "Você paga comissão sobre os contratos que fechar com a gente. Sem commitment obrigatório de fee fixo.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const META_PIXEL_IDS = (process.env.NEXT_PUBLIC_META_PIXEL_IDS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID || '';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${fraunces.variable} ${inter.variable}`}>
        <MetaPixel pixelIds={META_PIXEL_IDS} />
        <GoogleTags
          gaIds={GA_ID ? [GA_ID] : []}
          gadsIds={GADS_ID ? [GADS_ID] : []}
        />
        {children}
      </body>
    </html>
  );
}
