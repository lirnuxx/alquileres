import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  Home,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Header } from "@/components/layout/Header";

const sidebarLinks = [
  {
    group: "Panel",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Propiedades",
        href: "/dashboard/propiedades",
        icon: Building2,
      },
    ],
  },
  {
    group: "Reportes",
    items: [
      {
        label: "Estadísticas",
        href: "/dashboard/estadisticas",
        icon: BarChart3,
      },
    ],
  },
  {
    group: "Sistema",
    items: [
      {
        label: "Configuración",
        href: "/dashboard/configuracion",
        icon: Settings,
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {sidebarLinks.map((group) => (
              <div key={group.group}>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {group.group}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Home className="h-4 w-4" />
                Volver al sitio
              </Link>
            </div>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
