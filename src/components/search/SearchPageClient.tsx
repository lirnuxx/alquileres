"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type {
  OperationType,
  Property,
  SearchFilters,
} from "@/types/property";
import { OPERATION_LABELS } from "@/types/property";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FilterBar } from "@/components/search/FilterBar";
import { ResultsMap } from "@/components/search/ResultsMap";
import {
  DEFAULT_FILTERS,
  filterProperties,
  type PropertyWithDistance,
} from "@/lib/search";
import { cn } from "@/lib/utils";

interface SearchPageClientProps {
  initialProperties: Property[];
  cities: string[];
}

export function SearchPageClient({ initialProperties, cities }: SearchPageClientProps) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "ok" | "denied" | "error"
  >("idle");

  const results = useMemo(
    () => filterProperties(initialProperties, filters),
    [initialProperties, filters]
  );

  const requestNearMe = () => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFilters((f) => ({
          ...f,
          nearMe: true,
          userLat: pos.coords.latitude,
          userLng: pos.coords.longitude,
        }));
        setGeoStatus("ok");
      },
      () => {
        setGeoStatus("denied");
        setFilters((f) => ({ ...f, nearMe: false }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleNearMe = () => {
    if (filters.nearMe) {
      setFilters((f) => ({
        ...f,
        nearMe: false,
        userLat: null,
        userLng: null,
      }));
      setGeoStatus("idle");
      return;
    }
    requestNearMe();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Propiedades
            </p>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Alquiler y venta
            </h1>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Barrio, ciudad o dirección..."
                value={filters.query}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, query: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <OperationPills
                value={filters.operationType}
                onChange={(operationType) =>
                  setFilters((f) => ({ ...f, operationType }))
                }
              />
              <button
                type="button"
                onClick={toggleNearMe}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
                  filters.nearMe
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-brand-500"
                )}
              >
                <Navigation className="h-4 w-4" />
                Cerca de mí
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>

          {filters.nearMe && (
            <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="h-4 w-4" />
                Radio: {filters.radiusKm} km
              </span>
              <input
                type="range"
                min={1}
                max={50}
                value={filters.radiusKm}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    radiusKm: Number(e.target.value),
                  }))
                }
                className="w-40 accent-brand-600"
              />
              {geoStatus === "denied" && (
                <span className="text-amber-700">
                  Activá la ubicación en el navegador para usar este filtro.
                </span>
              )}
              {geoStatus === "loading" && (
                <span className="text-slate-500">Obteniendo ubicación…</span>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <FilterBar
            filters={filters}
            cities={cities}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        <section>
          <p className="mb-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{results.length}</span>{" "}
            propiedades encontradas
          </p>

          {view === "grid" ? (
            <ResultsGrid results={results} showDistance={filters.nearMe} />
          ) : (
            <ResultsMap properties={results} userLat={filters.userLat} userLng={filters.userLng} />
          )}

          <div className="mt-4 flex justify-center sm:hidden">
            <ViewToggle view={view} onChange={setView} />
          </div>
        </section>
      </main>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Cerrar filtros"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterBar
              filters={filters}
              cities={cities}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white"
            >
              Ver {results.length} resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsGrid({
  results,
  showDistance,
}: {
  results: PropertyWithDistance[];
  showDistance: boolean;
}) {
  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="font-medium text-slate-800">No hay propiedades con esos filtros</p>
        <p className="mt-1 text-sm text-slate-500">
          Probá ampliar el radio, quitar tipos de propiedad o cambiar la operación.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {results.map((p) => (
        <PropertyCard key={p.id} property={p} showDistance={showDistance} />
      ))}
    </div>
  );
}

function OperationPills({
  value,
  onChange,
}: {
  value: OperationType | "ALL";
  onChange: (v: OperationType | "ALL") => void;
}) {
  const options: { id: OperationType | "ALL"; label: string }[] = [
    { id: "ALL", label: "Todos" },
    { id: "RENT", label: OPERATION_LABELS.RENT },
    { id: "SALE", label: OPERATION_LABELS.SALE },
  ];
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            value === opt.id
              ? "bg-brand-600 text-white"
              : "text-slate-600 hover:bg-slate-50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: "grid" | "map";
  onChange: (v: "grid" | "map") => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-sm">
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          "rounded-lg px-3 py-1.5 font-medium",
          view === "grid" ? "bg-slate-900 text-white" : "text-slate-600"
        )}
      >
        Grilla
      </button>
      <button
        type="button"
        onClick={() => onChange("map")}
        className={cn(
          "rounded-lg px-3 py-1.5 font-medium",
          view === "map" ? "bg-slate-900 text-white" : "text-slate-600"
        )}
      >
        Mapa
      </button>
    </div>
  );
}
