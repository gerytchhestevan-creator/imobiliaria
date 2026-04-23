import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CompareProvider } from "@/components/property/CompareProvider";
import { CompareBar } from "@/components/property/CompareButton";
import { FavoriteProvider } from "@/components/property/FavoriteProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imobi2% | A Vitrine Inteligente para Venda de Imóveis",
  description: "Não somos uma imobiliária, somos um novo conceito de venda. Uma vitrine de alto padrão com curadoria especializada e apenas 2% de taxa de performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${cormorant.variable} ${geistMono.variable} antialiased`}
    >
      <body className="font-sans">
        <ThemeProvider>
          <CompareProvider>
            <FavoriteProvider>
              <Navbar />
              <CompareBar />
              {children}
            </FavoriteProvider>
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
