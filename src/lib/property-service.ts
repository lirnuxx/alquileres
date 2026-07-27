import type { Property, PropertyImage } from "@/types/property";
import { SEED_PROPERTIES, getPropertyById as getSeedById } from "./seed-properties";

/** 
 * Mutable property store initialized from seed data.
 * In Phase 1+ this will be replaced with Prisma/DB calls.
 * Until then, mutations exist in memory only (per server instance).
 */
let store: Property[] = [...SEED_PROPERTIES];
let nextId = 100;

export function getAllProperties(): Property[] {
  return store;
}

export function getPropertyById(id: string): Property | undefined {
  return store.find((p) => p.id === id) ?? getSeedById(id);
}

export function createProperty(
  data: Omit<Property, "id" | "status" | "images" | "createdAt" | "updatedAt">
): Property {
  const id = `prop-${nextId++}`;
  const property: Property = {
    ...data,
    id,
    status: "ACTIVE",
    images: [],
  };
  store.push(property);
  return property;
}

export function updateProperty(
  id: string,
  data: Partial<Omit<Property, "id" | "images">>
): Property | undefined {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  store[idx] = { ...store[idx], ...data };
  return store[idx];
}

export function deleteProperty(id: string): boolean {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

/** Get all unique cities from the store */
export function getCities(): string[] {
  return [...new Set(store.map((p) => p.city))].sort();
}
