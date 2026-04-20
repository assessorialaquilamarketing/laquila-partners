import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${fraunces.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
