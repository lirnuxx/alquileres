import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PropiedadesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">{children}</main>
      <Footer />
    </>
  );
}
