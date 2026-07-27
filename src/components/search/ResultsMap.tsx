"use client";

import Link from "next/link";
import type { PropertyWithDistance } from "@/lib/search";
import { formatPrice } from "@/lib/utils";
import { OPERATION_LABELS } from "@/types/property";

interface ResultsMapProps {
  properties: PropertyWithDistance[];
  userLat: number | null;
  userLng: number | null;
}

/** Vista mapa simplificada (MVP sin token Mapbox). Posiciones relativas al bounding box. */
export function ResultsMap({ properties, userLat, userLng }: ResultsMapProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
        No hay propiedades para mostrar en el mapa.
      </div>
    );
  }

  const lats = properties.map((p) => p.lat);
  const lngs = properties.map((p) => p.lng);
  if (userLat != null) lats.push(userLat);
  if (userLng != null) lngs.push(userLng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const project = (lat: number, lng: number) => {
    const x =
      maxLng === minLng ? 50 : ((lng - minLng) / (maxLng - minLng)) * 100;
    const y =
      maxLat === minLat ? 50 : (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        Vista previa del mapa — en producción se integra Mapbox (ver SPEC).
      </div>
      <div className="relative aspect-[16/10] w-full bg-[linear-gradient(180deg,#dbeafe_0%,#e2e8f0_100%)]">
        {userLat != null && userLng != null && (
          <MapDot
            {...project(userLat, userLng)}
            label="Tu ubicación"
            variant="user"
          />
        )}
        {properties.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          return (
            <Link
              key={p.id}
              href={`/propiedades/${p.id}`}
              className="group absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={p.title}
            >
              <span className="block rounded-lg bg-brand-600 px-2 py-1 text-xs font-semibold text-white shadow group-hover:bg-brand-700">
                {formatPrice(p.price, p.currency)}
              </span>
              <span className="mx-auto mt-0.5 block h-2 w-2 rounded-full bg-brand-600" />
            </Link>
          );
        })}
      </div>
      <ul className="max-h-48 divide-y divide-slate-100 overflow-y-auto bg-white">
        {properties.map((p) => (
          <li key={p.id}>
            <Link
              href={`/propiedades/${p.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"
            >
              <span className="font-medium text-slate-800">{p.title}</span>
              <span className="text-slate-500">{OPERATION_LABELS[p.operationType]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapDot({
  x,
  y,
  label,
  variant,
}: {
  x: number;
  y: number;
  label: string;
  variant: "user" | "property";
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        className={
          variant === "user"
            ? "flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow"
            : "h-3 w-3 rounded-full bg-brand-600"
        }
        title={label}
      />
    </div>
  );
}
