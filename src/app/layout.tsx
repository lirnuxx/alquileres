import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-expect-error CSS import supported by Next.js
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
  title: "Propiedades — Alquiler y venta",
  description:
    "Buscá departamentos, casas, lotes y más con filtros avanzados y ubicación cerca de vos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
