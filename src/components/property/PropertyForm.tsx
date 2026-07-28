"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { ActionState } from "@/server/actions/property-actions";
import {
  OPERATION_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
} from "@/types/property";

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Buenos Aires": { lat: -34.6037, lng: -58.3816 },
  "San Isidro": { lat: -34.4732, lng: -58.5271 },
  Ezeiza: { lat: -34.855, lng: -58.512 },
  Tigre: { lat: -34.412, lng: -58.652 },
};

interface PropertyFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  property?: Property;
  submitLabel?: string;
}

const initialState: ActionState = { ok: false, message: "" };

export function PropertyForm({
  action,
  property,
  submitLabel = "Guardar propiedad",
}: PropertyFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const defaultLat =
    property?.lat ?? CITY_COORDS["Buenos Aires"].lat;
  const defaultLng =
    property?.lng ?? CITY_COORDS["Buenos Aires"].lng;

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-900">Información básica</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              name="title"
              label="Título *"
              defaultValue={property?.title}
              error={state.fieldErrors?.title}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              name="description"
              label="Descripción *"
              rows={4}
              defaultValue={property?.description}
              error={state.fieldErrors?.description}
              required
            />
          </div>
          <Select
            name="operationType"
            label="Operación *"
            defaultValue={property?.operationType ?? "RENT"}
          >
            {Object.entries(OPERATION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <Select
            name="propertyType"
            label="Tipo de propiedad *"
            defaultValue={property?.propertyType ?? "APARTMENT"}
          >
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <Select
            name="status"
            label="Estado"
            defaultValue={property?.status ?? "ACTIVE"}
          >
            <option value="ACTIVE">Activa</option>
            <option value="PAUSED">Pausada</option>
            <option value="RENTED">Alquilada</option>
            <option value="SOLD">Vendida</option>
          </Select>
          <Input
            name="price"
            label="Precio *"
            type="number"
            min={1}
            step="any"
            defaultValue={property?.price}
            error={state.fieldErrors?.price}
            required
          />
          <Select
            name="currency"
            label="Moneda"
            defaultValue={property?.currency ?? "ARS"}
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </Select>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-900">Medidas y ambientes</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            name="rooms"
            label="Ambientes"
            type="number"
            min={0}
            defaultValue={property?.rooms ?? ""}
          />
          <Input
            name="bedrooms"
            label="Dormitorios"
            type="number"
            min={0}
            defaultValue={property?.bedrooms ?? ""}
          />
          <Input
            name="bathrooms"
            label="Baños"
            type="number"
            min={0}
            defaultValue={property?.bathrooms ?? ""}
          />
          <Input
            name="coveredArea"
            label="m² cubiertos"
            type="number"
            min={0}
            step="any"
            defaultValue={property?.coveredArea ?? ""}
          />
          <Input
            name="totalArea"
            label="m² totales"
            type="number"
            min={0}
            step="any"
            defaultValue={property?.totalArea ?? ""}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-900">Ubicación</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="address"
            label="Dirección *"
            defaultValue={property?.address}
            error={state.fieldErrors?.address}
            required
          />
          <Input
            name="neighborhood"
            label="Barrio"
            defaultValue={property?.neighborhood ?? ""}
          />
          <Input
            name="city"
            label="Ciudad *"
            list="cities-list"
            defaultValue={property?.city ?? "Buenos Aires"}
            error={state.fieldErrors?.city}
            required
          />
          <datalist id="cities-list">
            {Object.keys(CITY_COORDS).map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Input
            name="lat"
            label="Latitud *"
            type="number"
            step="any"
            defaultValue={defaultLat}
            error={state.fieldErrors?.lat}
            required
          />
          <Input
            name="lng"
            label="Longitud *"
            type="number"
            step="any"
            defaultValue={defaultLng}
            error={state.fieldErrors?.lng}
            required
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Tip: podés obtener coordenadas desde Google Maps (clic derecho → copiar lat/lng).
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-900">Imagen y amenities</h2>
        <div className="grid gap-4">
          <Input
            name="imageUrl"
            label="URL de imagen"
            type="url"
            placeholder="https://images.unsplash.com/..."
            defaultValue={
              property?.images.find((i) => i.isCover)?.url ??
              property?.images[0]?.url ??
              ""
            }
          />
          <Input
            name="amenities"
            label="Amenities (separados por coma)"
            placeholder="Pileta, Garage, Seguridad"
            defaultValue={property?.amenities.join(", ") ?? ""}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
