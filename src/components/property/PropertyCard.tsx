import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, MapPin, Maximize2, DoorOpen } from "lucide-react";
import { formatDistanceKm } from "@/lib/geo";
import { cn, formatPrice } from "@/lib/utils";
import {
  OPERATION_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/types/property";
import type { PropertyWithDistance } from "@/lib/search";

type CardProperty = PropertyWithDistance;

interface PropertyCardProps {
  property: CardProperty;
  showDistance?: boolean;
}

export function PropertyCard({ property, showDistance }: PropertyCardProps) {
  const cover =
    property.images.find((i) => i.isCover)?.url ?? property.images[0]?.url;
  const distance = "distanceKm" in property ? property.distanceKm : null;

  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-500/40 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Sin imagen
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow">
            {OPERATION_LABELS[property.operationType]}
          </span>
          <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            {PROPERTY_TYPE_LABELS[property.propertyType]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(property.price, property.currency)}
            {property.operationType === "RENT" && (
              <span className="text-sm font-normal text-slate-500"> / mes</span>
            )}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-slate-800 group-hover:text-brand-600">
            {property.title}
          </h3>
        </div>

        <p className="flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>
            {property.neighborhood ? `${property.neighborhood}, ` : ""}
            {property.city}
          </span>
        </p>

        {showDistance && distance != null && (
          <p className="text-xs font-medium text-brand-600">
            A {formatDistanceKm(distance)} de tu ubicación
          </p>
        )}

        <ul className="mt-auto flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
          {property.rooms != null && (
            <li className="flex items-center gap-1">
              <DoorOpen className="h-3.5 w-3.5" />
              {property.rooms} amb.
            </li>
          )}
          {property.bedrooms != null && property.bedrooms > 0 && (
            <li className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {property.bedrooms} dorm.
            </li>
          )}
          {property.bathrooms != null && (
            <li className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms} baño
              {property.bathrooms > 1 ? "s" : ""}
            </li>
          )}
          {(property.coveredArea ?? property.totalArea) != null && (
            <li className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {property.coveredArea != null && `${property.coveredArea} m² cub.`}
              {property.coveredArea != null && property.totalArea != null && " · "}
              {property.totalArea != null &&
                property.totalArea !== property.coveredArea &&
                `${property.totalArea} m² tot.`}
              {property.propertyType === "LAND" &&
                property.totalArea != null &&
                `${property.totalArea} m²`}
            </li>
          )}
        </ul>

        <p className={cn("text-xs text-slate-400")}>{property.tenantName}</p>
      </div>
    </Link>
  );
}
