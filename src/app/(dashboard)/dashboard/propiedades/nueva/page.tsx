import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/property/PropertyForm";
import { createPropertyAction } from "@/server/actions/property-actions";

export default function NewPropertyPage() {
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
          Nueva propiedad
        </h2>
        <p className="text-sm text-slate-600">
          Completá los datos para publicar en el buscador público.
        </p>
      </div>

      <PropertyForm
        action={createPropertyAction}
        submitLabel="Publicar propiedad"
      />
    </div>
  );
}
