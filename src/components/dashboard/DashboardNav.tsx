import Link from "next/link";
import { Building2, Home, Inbox, LayoutDashboard, Plus } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/propiedades/nueva", label: "Nueva propiedad", icon: Plus },
  { href: "/dashboard/leads", label: "Consultas", icon: Inbox },
];

export function DashboardNav() {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
      <Link
        href="/"
        className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
      >
        <Home className="h-4 w-4" />
        Ver buscador público
      </Link>
    </nav>
  );
}
