"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProperty,
  deleteProperty,
  getDefaultTenant,
  updateProperty,
  type PropertyInput,
} from "@/server/services/propertyService";
import type {
  OperationType,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (!value || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function parseOptionalFloat(value: FormDataEntryValue | null): number | null {
  if (!value || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseFormData(formData: FormData): {
  data: PropertyInput | null;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const price = Number(formData.get("price"));
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));

  if (!title) errors.title = "El título es obligatorio";
  if (!description) errors.description = "La descripción es obligatoria";
  if (!address) errors.address = "La dirección es obligatoria";
  if (!city) errors.city = "La ciudad es obligatoria";
  if (!Number.isFinite(price) || price <= 0)
    errors.price = "Ingresá un precio válido";
  if (!Number.isFinite(lat)) errors.lat = "Latitud inválida";
  if (!Number.isFinite(lng)) errors.lng = "Longitud inválida";

  const amenitiesRaw = String(formData.get("amenities") ?? "").trim();
  const amenities = amenitiesRaw
    ? amenitiesRaw.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  if (Object.keys(errors).length > 0) return { data: null, errors };

  return {
    data: {
      tenantId: "",
      title,
      description,
      operationType: formData.get("operationType") as OperationType,
      propertyType: formData.get("propertyType") as PropertyType,
      status: (formData.get("status") as PropertyStatus) || "ACTIVE",
      price,
      currency: String(formData.get("currency") ?? "ARS"),
      coveredArea: parseOptionalFloat(formData.get("coveredArea")),
      totalArea: parseOptionalFloat(formData.get("totalArea")),
      rooms: parseOptionalInt(formData.get("rooms")),
      bedrooms: parseOptionalInt(formData.get("bedrooms")),
      bathrooms: parseOptionalInt(formData.get("bathrooms")),
      address,
      neighborhood: String(formData.get("neighborhood") ?? "").trim() || null,
      city,
      lat,
      lng,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || undefined,
      amenities,
    },
    errors,
  };
}

export async function createPropertyAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const tenant = await getDefaultTenant();
  if (!tenant) {
    return {
      ok: false,
      message: "No hay inmobiliaria configurada. Ejecutá: npm run db:seed",
    };
  }

  const { data, errors } = parseFormData(formData);
  if (!data) {
    return {
      ok: false,
      message: "Revisá los campos marcados",
      fieldErrors: errors,
    };
  }

  try {
    data.tenantId = tenant.id;
    await createProperty(data);
    revalidatePath("/");
    revalidatePath("/dashboard/propiedades");
    redirect("/dashboard/propiedades?created=1");
  } catch {
    return { ok: false, message: "No se pudo crear la propiedad" };
  }
}

export async function updatePropertyAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { data, errors } = parseFormData(formData);
  if (!data) {
    return {
      ok: false,
      message: "Revisá los campos marcados",
      fieldErrors: errors,
    };
  }

  try {
    await updateProperty(id, data);
    revalidatePath("/");
    revalidatePath("/dashboard/propiedades");
    revalidatePath(`/propiedades/${id}`);
    redirect("/dashboard/propiedades?updated=1");
  } catch {
    return { ok: false, message: "No se pudo actualizar la propiedad" };
  }
}

export async function deletePropertyAction(id: string): Promise<ActionState> {
  try {
    await deleteProperty(id);
    revalidatePath("/");
    revalidatePath("/dashboard/propiedades");
    return { ok: true, message: "Propiedad eliminada" };
  } catch {
    return { ok: false, message: "No se pudo eliminar la propiedad" };
  }
}

export async function togglePropertyStatusAction(
  id: string,
  status: PropertyStatus
): Promise<ActionState> {
  try {
    await updateProperty(id, { status });
    revalidatePath("/");
    revalidatePath("/dashboard/propiedades");
    revalidatePath(`/propiedades/${id}`);
    return { ok: true, message: "Estado actualizado" };
  } catch {
    return { ok: false, message: "No se pudo cambiar el estado" };
  }
}
