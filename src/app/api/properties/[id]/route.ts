import { NextResponse } from "next/server";
import {
  deleteProperty,
  getPropertyById,
  updateProperty,
} from "@/server/services/propertyService";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const property = await getPropertyById(id);
  if (!property) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  return NextResponse.json(property);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const property = await updateProperty(id, body);
    return NextResponse.json(property);
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    await deleteProperty(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 400 });
  }
}
