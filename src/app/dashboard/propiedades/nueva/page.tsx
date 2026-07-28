"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "../PropertyForm";
import type { PropertyFormData } from "../PropertyForm";
import { createProperty } from "@/lib/property-service";

export default function NewPropertyPage() {
  const router = useRouter();

  const handleSubmit = (data: PropertyFormData) => {
    createProperty(data);
    router.push("/dashboard/propiedades");
    router.refresh();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Nueva propiedad
      </h1>
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
