import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/property/PropertyForm";
import { updatePropertyAction } from "@/server/actions/property-actions";
import { getPropertyById } from "@/server/services/propertyService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const boundUpdate = updatePropertyAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/propiedades"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a propiedades
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Editar propiedad
        </h2>
        <p className="text-sm text-slate-600">{property.title}</p>
      </div>

      <PropertyForm
        action={boundUpdate}
        property={property}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
