"use client";

import { useTransition } from "react";
import { Trash2, Pause, Play, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  deletePropertyAction,
  togglePropertyStatusAction,
} from "@/server/actions/property-actions";
import { formatPrice } from "@/lib/utils";
import {
  OPERATION_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
} from "@/types/property";

interface PropertyRowActionsProps {
  property: Property;
}

export function PropertyRowActions({ property }: PropertyRowActionsProps) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`¿Eliminar "${property.title}"?`)) return;
    startTransition(async () => {
      await deletePropertyAction(property.id);
    });
  };

  const handleToggle = () => {
    const next = property.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    startTransition(async () => {
      await togglePropertyStatusAction(property.id, next);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/propiedades/${property.id}`}>
        <Button variant="outline" size="sm">
          Ver
        </Button>
      </Link>
      <Link href={`/dashboard/propiedades/${property.id}/editar`}>
        <Button variant="outline" size="sm">
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
      </Link>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={pending}
      >
        {property.status === "ACTIVE" ? (
          <>
            <Pause className="h-3.5 w-3.5" /> Pausar
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5" /> Activar
          </>
        )}
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={pending}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function PropertyTableRow({ property }: { property: Property }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80">
      <td className="px-4 py-3">
        <p className="font-medium text-slate-900">{property.title}</p>
        <p className="text-xs text-slate-500">
          {property.neighborhood ? `${property.neighborhood}, ` : ""}
          {property.city}
        </p>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {PROPERTY_TYPE_LABELS[property.propertyType]}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {OPERATION_LABELS[property.operationType]}
      </td>
      <td className="px-4 py-3 text-sm font-medium">
        {formatPrice(property.price, property.currency)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={property.status} />
      </td>
      <td className="px-4 py-3">
        <PropertyRowActions property={property} />
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: Property["status"] }) {
  const styles = {
    ACTIVE: "bg-emerald-100 text-emerald-800",
    PAUSED: "bg-amber-100 text-amber-800",
    RENTED: "bg-blue-100 text-blue-800",
    SOLD: "bg-slate-200 text-slate-700",
  };
  const labels = {
    ACTIVE: "Activa",
    PAUSED: "Pausada",
    RENTED: "Alquilada",
    SOLD: "Vendida",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
