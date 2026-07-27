import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Propiedades Platform. Todos los
          derechos reservados.
        </p>
        <nav className="flex gap-6 text-sm">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-700"
          >
            Buscador
          </Link>
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-slate-700"
          >
            Panel
          </Link>
        </nav>
      </div>
    </footer>
  );
}
