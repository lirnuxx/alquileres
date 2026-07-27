import { haversineDistanceKm } from "@/lib/geo";
import type { Property, SearchFilters } from "@/types/property";

export type PropertyWithDistance = Property & { distanceKm: number | null };

export function filterProperties(
  properties: Property[],
  filters: SearchFilters
): PropertyWithDistance[] {
  const q = filters.query.trim().toLowerCase();

  let result: PropertyWithDistance[] = properties
    .filter((p) => p.status === "ACTIVE")
    .map((p) => {
      let distanceKm: number | null = null;
      if (filters.userLat != null && filters.userLng != null) {
        distanceKm = haversineDistanceKm(
          filters.userLat,
          filters.userLng,
          p.lat,
          p.lng
        );
      }
      return { ...p, distanceKm };
    });

  if (filters.operationType !== "ALL") {
    result = result.filter((p) => p.operationType === filters.operationType);
  }

  if (filters.propertyTypes.length > 0) {
    result = result.filter((p) => filters.propertyTypes.includes(p.propertyType));
  }

  if (filters.city) {
    result = result.filter((p) => p.city === filters.city);
  }

  if (filters.priceMin != null) {
    result = result.filter((p) => p.price >= filters.priceMin!);
  }
  if (filters.priceMax != null) {
    result = result.filter((p) => p.price <= filters.priceMax!);
  }

  if (filters.roomsMin != null) {
    result = result.filter(
      (p) => p.rooms != null && p.rooms >= filters.roomsMin!
    );
  }

  if (filters.bedroomsMin != null) {
    result = result.filter(
      (p) => p.bedrooms != null && p.bedrooms >= filters.bedroomsMin!
    );
  }

  if (filters.coveredAreaMin != null) {
    result = result.filter(
      (p) => p.coveredArea != null && p.coveredArea >= filters.coveredAreaMin!
    );
  }

  if (filters.totalAreaMin != null) {
    result = result.filter(
      (p) => p.totalArea != null && p.totalArea >= filters.totalAreaMin!
    );
  }

  if (filters.nearMe && filters.userLat != null && filters.userLng != null) {
    result = result.filter(
      (p) =>
        p.distanceKm != null && p.distanceKm <= filters.radiusKm
    );
  }

  if (q) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.neighborhood?.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }

  if (filters.nearMe && filters.userLat != null) {
    result.sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
    );
  }

  return result;
}

export const DEFAULT_FILTERS: SearchFilters = {
  operationType: "ALL",
  propertyTypes: [],
  city: "",
  priceMin: null,
  priceMax: null,
  roomsMin: null,
  bedroomsMin: null,
  coveredAreaMin: null,
  totalAreaMin: null,
  nearMe: false,
  radiusKm: 10,
  userLat: null,
  userLng: null,
  query: "",
};
