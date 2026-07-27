import { NextResponse } from "next/server";
import { SEED_PROPERTIES } from "@/lib/seed-properties";
import { DEFAULT_FILTERS, filterProperties } from "@/lib/search";
import type { SearchFilters } from "@/types/property";

/** GET /api/search — alineado al SPEC (MVP con datos seed) */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: SearchFilters = {
    ...DEFAULT_FILTERS,
    operationType:
      (searchParams.get("operationType") as SearchFilters["operationType"]) ||
      "ALL",
    city: searchParams.get("city") ?? "",
    priceMin: searchParams.get("priceMin")
      ? Number(searchParams.get("priceMin"))
      : null,
    priceMax: searchParams.get("priceMax")
      ? Number(searchParams.get("priceMax"))
      : null,
    roomsMin: searchParams.get("roomsMin")
      ? Number(searchParams.get("roomsMin"))
      : null,
    bedroomsMin: searchParams.get("bedroomsMin")
      ? Number(searchParams.get("bedroomsMin"))
      : null,
    coveredAreaMin: searchParams.get("coveredAreaMin")
      ? Number(searchParams.get("coveredAreaMin"))
      : null,
    totalAreaMin: searchParams.get("totalAreaMin")
      ? Number(searchParams.get("totalAreaMin"))
      : null,
    nearMe: Boolean(searchParams.get("lat") && searchParams.get("lng")),
    radiusKm: searchParams.get("radiusKm")
      ? Number(searchParams.get("radiusKm"))
      : 10,
    userLat: searchParams.get("lat") ? Number(searchParams.get("lat")) : null,
    userLng: searchParams.get("lng") ? Number(searchParams.get("lng")) : null,
    query: searchParams.get("q") ?? "",
    propertyTypes: (searchParams.get("propertyType") ?? "")
      .split(",")
      .filter(Boolean) as SearchFilters["propertyTypes"],
  };

  const results = filterProperties(SEED_PROPERTIES, filters);
  return NextResponse.json({
    page: Number(searchParams.get("page") ?? 1),
    total: results.length,
    data: results,
  });
}
