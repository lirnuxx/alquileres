import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const property = await db.property.findUnique({
      where: { id: body.propertyId },
      select: { id: true, tenantId: true },
    });

    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const lead = await db.lead.create({
      data: {
        propertyId: property.id,
        tenantId: property.tenantId,
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        message: body.message ?? null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear lead" }, { status: 400 });
  }
}

export async function GET() {
  const leads = await db.lead.findMany({
    include: { property: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ total: leads.length, data: leads });
}
