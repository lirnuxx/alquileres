"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import {
  OPERATION_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/types/property";
import { formatPrice } from "@/lib/utils";
import { deleteProperty } from "@/lib/property-service";

interface PropertyTableProps {
  properties: Property[];
}

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Activa" },
  PAUSED: { bg: "bg-amber-100", text: "text-amber-700", label: "Pausada" },
  RENTED: { bg: "bg-blue-100", text: "text-blue-700", label: "Alquilada" },
  SOLD: { bg: "bg-slate-200", text: "text-slate-700", label: "Vendida" },
};

export function PropertyTable({ properties }: PropertyTableProps) {
  const router = useRouter();

  const handleDelete = (id: string, title: string) => {
    if (
      !window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)
    )
      return;
    deleteProperty(id);
    router.refresh();
  };

  if (properties.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        No hay propiedades todavía.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase text-slate-500">
            <th className="px-4 py-3">Propiedad</th>
            <th className="hidden px-4 py-3 md:table-cell">Tipo</th>
            <th className="hidden px-4 py-3 md:table-cell">Operación</th>
            <th className="px-4 py-3">Precio</th>
            <th className="hidden px-4 py-3 md:table-cell">Ubicación</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {properties.map((p) => {
            const statusStyle = STATUS_COLORS[p.status] ?? STATUS_COLORS.ACTIVE;
            return (
              <tr
                key={p.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {p.title}
                </td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                  {PROPERTY_TYPE_LABELS[p.propertyType]}
                </td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                  {OPERATION_LABELS[p.operationType]}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {formatPrice(p.price, p.currency)}
                </td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                  {p.city}
                  {p.neighborhood && ` · ${p.neighborhood}`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/propiedades/${p.id}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Ver en el sitio"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/propiedades/${p.id}/editar`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.title)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
