"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export type LeadActionState = {
  ok: boolean;
  message: string;
};

export async function submitLeadAction(
  _prev: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const propertyId = String(formData.get("propertyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email) {
    return { ok: false, message: "Nombre y email son obligatorios" };
  }

  const property = await db.property.findUnique({
    where: { id: propertyId },
    select: { id: true, tenantId: true },
  });

  if (!property) {
    return { ok: false, message: "Propiedad no encontrada" };
  }

  try {
    await db.lead.create({
      data: {
        propertyId: property.id,
        tenantId: property.tenantId,
        name,
        email,
        phone: phone || null,
        message: message || null,
      },
    });
    revalidatePath("/dashboard/leads");
    return {
      ok: true,
      message: "¡Consulta enviada! La inmobiliaria te contactará pronto.",
    };
  } catch {
    return { ok: false, message: "Error al enviar. Intentá de nuevo." };
  }
}
