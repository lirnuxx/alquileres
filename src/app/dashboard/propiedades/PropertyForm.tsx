"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/types/property";
import {
  PROPERTY_TYPE_LABELS,
  OPERATION_LABELS,
} from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => void;
}

export interface PropertyFormData {
  title: string;
  description: string;
  operationType: "RENT" | "SALE";
  propertyType: Property["propertyType"];
  price: number;
  currency: string;
  coveredArea: number | null;
  totalArea: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string;
  neighborhood: string | null;
  city: string;
  lat: number;
  lng: number;
  tenantId: string;
  tenantName: string;
  amenities: string[];
}

const DEFAULT_FORM: PropertyFormData = {
  title: "",
  description: "",
  operationType: "RENT",
  propertyType: "APARTMENT",
  price: 0,
  currency: "ARS",
  coveredArea: null,
  totalArea: null,
  rooms: null,
  bedrooms: null,
  bathrooms: null,
  address: "",
  neighborhood: null,
  city: "",
  lat: -34.6037,
  lng: -58.3816,
  tenantId: "t1",
  tenantName: "Inmobiliaria Sur",
  amenities: [],
};

export function PropertyForm({ property, onSubmit }: PropertyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PropertyFormData>(() => {
    if (!property) return DEFAULT_FORM;
    return {
      title: property.title,
      description: property.description,
      operationType: property.operationType,
      propertyType: property.propertyType,
      price: property.price,
      currency: property.currency,
      coveredArea: property.coveredArea,
      totalArea: property.totalArea,
      rooms: property.rooms,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      address: property.address,
      neighborhood: property.neighborhood,
      city: property.city,
      lat: property.lat,
      lng: property.lng,
      tenantId: property.tenantId,
      tenantName: property.tenantName,
      amenities: property.amenities,
    };
  });
  const [amenitiesInput, setAmenitiesInput] = useState(
    form.amenities.join(", ")
  );

  const patch = (partial: Partial<PropertyFormData>) =>
    setForm((f) => ({ ...f, ...partial }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amenities: amenitiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la propiedad</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Ej: Departamento luminoso en Palermo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="Describí la propiedad en detalle..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Operación"
              value={form.operationType}
              onChange={(e) =>
                patch({ operationType: e.target.value as "RENT" | "SALE" })
              }
            >
              <option value="RENT">{OPERATION_LABELS.RENT}</option>
              <option value="SALE">{OPERATION_LABELS.SALE}</option>
            </Select>
            <Select
              label="Tipo de propiedad"
              value={form.propertyType}
              onChange={(e) =>
                patch({ propertyType: e.target.value as Property["propertyType"] })
              }
            >
              {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
            <Select
              label="Moneda"
              value={form.currency}
              onChange={(e) => patch({ currency: e.target.value })}
            >
              <option value="ARS">ARS ($)</option>
              <option value="USD">USD (US$)</option>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                required
                min={0}
                value={form.price || ""}
                onChange={(e) => patch({ price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantName">Inmobiliaria / Tenant</Label>
              <Input
                id="tenantName"
                required
                value={form.tenantName}
                onChange={(e) => patch({ tenantName: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dimensiones y espacios</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>M² cubiertos</Label>
            <Input
              type="number"
              min={0}
              value={form.coveredArea ?? ""}
              onChange={(e) =>
                patch({
                  coveredArea: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>M² totales</Label>
            <Input
              type="number"
              min={0}
              value={form.totalArea ?? ""}
              onChange={(e) =>
                patch({
                  totalArea: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Ambientes</Label>
            <Input
              type="number"
              min={0}
              value={form.rooms ?? ""}
              onChange={(e) =>
                patch({
                  rooms: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Dormitorios</Label>
            <Input
              type="number"
              min={0}
              value={form.bedrooms ?? ""}
              onChange={(e) =>
                patch({
                  bedrooms: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Baños</Label>
            <Input
              type="number"
              min={0}
              value={form.bathrooms ?? ""}
              onChange={(e) =>
                patch({
                  bathrooms: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              required
              value={form.address}
              onChange={(e) => patch({ address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Barrio</Label>
            <Input
              id="neighborhood"
              value={form.neighborhood ?? ""}
              onChange={(e) =>
                patch({ neighborhood: e.target.value || null })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              required
              value={form.city}
              onChange={(e) => patch({ city: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Latitud</Label>
              <Input
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => patch({ lat: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Longitud</Label>
              <Input
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => patch({ lng: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Servicios y amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="amenities">
              Amenities (separados por coma)
            </Label>
            <Input
              id="amenities"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              placeholder="Ej: Pileta, SUM, Seguridad 24h"
            />
            {form.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {form.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {property ? "Guardar cambios" : "Publicar propiedad"}
        </Button>
      </div>
    </form>
  );
}
