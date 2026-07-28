import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { getDefaultTenant } from "@/server/services/propertyService";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getDefaultTenant();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Panel inmobiliaria
            </p>
            <h1 className="text-lg font-bold text-slate-900">
              {tenant?.name ?? "Sin inmobiliaria"}
            </h1>
          </div>
          <Link
            href="/dashboard/propiedades/nueva"
            className="hidden rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:inline-flex"
          >
            + Nueva propiedad
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
