import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  DoorOpen,
  MapPin,
  Maximize2,
} from "lucide-react";
import { ContactLeadForm } from "@/components/property/ContactLeadForm";
import { getPropertyById } from "@/server/services/propertyService";
import { formatPrice } from "@/lib/utils";
import {
  OPERATION_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/types/property";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property || property.status !== "ACTIVE") notFound();

  const cover =
    property.images.find((i) => i.isCover)?.url ?? property.images[0]?.url;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al buscador
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-200">
          {cover && (
            <Image
              src={cover}
              alt={property.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          )}
        </div>

        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                {OPERATION_LABELS[property.operationType]}
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                {PROPERTY_TYPE_LABELS[property.propertyType]}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-slate-600">
              <MapPin className="h-4 w-4 shrink-0" />
              {property.address},{" "}
              {property.neighborhood && `${property.neighborhood}, `}
              {property.city}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(property.price, property.currency)}
            </p>
            {property.operationType === "RENT" && (
              <p className="text-sm text-slate-500">por mes</p>
            )}
            <p className="mt-2 text-xs text-slate-400">{property.tenantName}</p>
          </div>
        </header>

        <ul className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {property.rooms != null && (
            <li className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-slate-400" />
              {property.rooms} ambientes
            </li>
          )}
          {property.bedrooms != null && (
            <li className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-slate-400" />
              {property.bedrooms} dormitorios
            </li>
          )}
          {property.bathrooms != null && (
            <li className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-slate-400" />
              {property.bathrooms} baños
            </li>
          )}
          {property.coveredArea != null && (
            <li className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-slate-400" />
              {property.coveredArea} m² cubiertos
            </li>
          )}
          {property.totalArea != null && (
            <li className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-slate-400" />
              {property.totalArea} m² totales
            </li>
          )}
        </ul>

        <section className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900">Descripción</h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              {property.description}
            </p>
            {property.amenities.length > 0 && (
              <>
                <h2 className="mt-8 text-lg font-bold text-slate-900">
                  Amenities
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside>
            <ContactLeadForm
              propertyId={property.id}
              propertyTitle={property.title}
            />
          </aside>
        </section>
      </article>
    </div>
  );
}
