import Link from "next/link";
import { Plus } from "lucide-react";
import { PropertyTableRow } from "@/components/dashboard/PropertyRowActions";
import { listProperties } from "@/server/services/propertyService";

interface PageProps {
  searchParams: Promise<{ created?: string; updated?: string }>;
}

export default async function DashboardPropertiesPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const properties = await listProperties();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Propiedades</h2>
          <p className="text-sm text-slate-600">
            {properties.length} en total · las activas aparecen en el buscador
          </p>
        </div>
        <Link
          href="/dashboard/propiedades/nueva"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Nueva propiedad
        </Link>
      </div>

      {params.created === "1" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Propiedad creada correctamente y visible en el buscador (si está activa).
        </div>
      )}
      {params.updated === "1" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Propiedad actualizada.
        </div>
      )}

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-medium text-slate-800">No hay propiedades todavía</p>
          <p className="mt-1 text-sm text-slate-500">
            Ejecutá <code className="rounded bg-slate-100 px-1">npm run db:seed</code> o
            creá la primera desde el botón de arriba.
          </p>
          <Link
            href="/dashboard/propiedades/nueva"
            className="mt-4 inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Agregar propiedad
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Propiedad</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Operación</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <PropertyTableRow key={p.id} property={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
