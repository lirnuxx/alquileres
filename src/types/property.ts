export type OperationType = "RENT" | "SALE";

export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "PH"
  | "LAND"
  | "OFFICE"
  | "COMMERCIAL_LOCAL";

export type PropertyStatus = "ACTIVE" | "PAUSED" | "RENTED" | "SOLD";

export interface PropertyImage {
  id: string;
  url: string;
  order: number;
  isCover: boolean;
}

export interface Property {
  id: string;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  operationType: OperationType;
  propertyType: PropertyType;
  status: PropertyStatus;
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
  images: PropertyImage[];
  amenities: string[];
}

export interface SearchFilters {
  operationType: OperationType | "ALL";
  propertyTypes: PropertyType[];
  city: string;
  priceMin: number | null;
  priceMax: number | null;
  roomsMin: number | null;
  bedroomsMin: number | null;
  coveredAreaMin: number | null;
  totalAreaMin: number | null;
  nearMe: boolean;
  radiusKm: number;
  userLat: number | null;
  userLng: number | null;
  query: string;
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: "Departamento",
  HOUSE: "Casa",
  PH: "PH",
  LAND: "Lote / Terreno",
  OFFICE: "Oficina",
  COMMERCIAL_LOCAL: "Local comercial",
};

export const OPERATION_LABELS: Record<OperationType, string> = {
  RENT: "Alquiler",
  SALE: "Venta",
};
