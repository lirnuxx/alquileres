import { NextResponse } from "next/server";
import {
  createProperty,
  getDefaultTenant,
  listProperties,
} from "@/server/services/propertyService";
import type { OperationType, PropertyType } from "@/types/property";

export async function GET() {
  const properties = await listProperties();
  return NextResponse.json({ total: properties.length, data: properties });
}

export async function POST(request: Request) {
  const tenant = await getDefaultTenant();
  if (!tenant) {
    return NextResponse.json(
      { error: "No hay inmobiliaria configurada" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const property = await createProperty({
      tenantId: tenant.id,
      title: body.title,
      description: body.description,
      operationType: body.operationType as OperationType,
      propertyType: body.propertyType as PropertyType,
      price: Number(body.price),
      currency: body.currency ?? "ARS",
      coveredArea: body.coveredArea ?? null,
      totalArea: body.totalArea ?? null,
      rooms: body.rooms ?? null,
      bedrooms: body.bedrooms ?? null,
      bathrooms: body.bathrooms ?? null,
      address: body.address,
      neighborhood: body.neighborhood ?? null,
      city: body.city,
      lat: Number(body.lat),
      lng: Number(body.lng),
      imageUrl: body.imageUrl,
      amenities: body.amenities ?? [],
    });
    return NextResponse.json(property, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear propiedad" }, { status: 400 });
  }
}
