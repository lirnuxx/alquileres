import Link from "next/link";
import { Building2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">Propiedades</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Buscar
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Panel de control
          </Link>
        </nav>
      </div>
    </header>
  );
}
