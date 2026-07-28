import Link from "next/link";
import { Building2, Inbox, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { listProperties } from "@/server/services/propertyService";

export default async function DashboardHomePage() {
  const properties = await listProperties();
  const active = properties.filter((p) => p.status === "ACTIVE").length;
  const leadsCount = await db.lead.count();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Resumen</h2>
        <p className="text-sm text-slate-600">
          Fase 1 — panel interno sin auth (según SPEC).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Propiedades totales"
          value={properties.length}
        />
        <StatCard icon={Building2} label="Activas en buscador" value={active} />
        <StatCard icon={Inbox} label="Consultas recibidas" value={leadsCount} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-slate-900">Acciones rápidas</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/propiedades/nueva"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Agregar propiedad
          </Link>
          <Link
            href="/dashboard/propiedades"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-500"
          >
            Gestionar propiedades
          </Link>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-500"
          >
            Ver consultas
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-brand-600" />
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}
