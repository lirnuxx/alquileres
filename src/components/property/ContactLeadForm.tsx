"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  submitLeadAction,
  type LeadActionState,
} from "@/server/actions/lead-actions";

const initialState: LeadActionState = { ok: false, message: "" };

interface ContactLeadFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function ContactLeadForm({
  propertyId,
  propertyTitle,
}: ContactLeadFormProps) {
  const [state, formAction, pending] = useActionState(
    submitLeadAction,
    initialState
  );

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-emerald-600 p-5 text-white">
        <p className="font-semibold">¡Consulta enviada!</p>
        <p className="mt-1 text-sm text-emerald-100">{state.message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-brand-600 p-5 text-white">
      <p className="font-semibold">¿Te interesa?</p>
      <p className="mt-1 text-sm text-brand-100">
        Consultá por <strong>{propertyTitle}</strong>
      </p>

      <form action={formAction} className="mt-4 space-y-3">
        <input type="hidden" name="propertyId" value={propertyId} />
        <Input
          name="name"
          placeholder="Tu nombre *"
          required
          className="border-0"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email *"
          required
          className="border-0"
        />
        <Input
          name="phone"
          type="tel"
          placeholder="Teléfono (opcional)"
          className="border-0"
        />
        <Textarea
          name="message"
          placeholder="Mensaje (opcional)"
          rows={3}
          className="border-0"
        />
        {state.message && !state.ok && (
          <p className="text-sm text-red-200">{state.message}</p>
        )}
        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-white text-brand-700 hover:bg-brand-50"
        >
          {pending ? "Enviando…" : "Solicitar información"}
        </Button>
      </form>
    </div>
  );
}
