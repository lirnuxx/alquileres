"use client";

import { useRouter, notFound, useParams } from "next/navigation";
import { PropertyForm } from "../../PropertyForm";
import type { PropertyFormData } from "../../PropertyForm";
import { getPropertyById, updateProperty } from "@/lib/property-service";
import { Card, CardContent } from "@/components/ui/card";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  const handleSubmit = (data: PropertyFormData) => {
    updateProperty(params.id, data);
    router.push("/dashboard/propiedades");
    router.refresh();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Editar: {property.title}
      </h1>
      <PropertyForm property={property} onSubmit={handleSubmit} />
    </div>
  );
}
