"use client";

import type { SearchFilters, PropertyType } from "@/types/property";
import { PROPERTY_TYPE_LABELS } from "@/types/property";

const ALL_PROPERTY_TYPES = Object.keys(
  PROPERTY_TYPE_LABELS
) as PropertyType[];

interface FilterBarProps {
  filters: SearchFilters;
  cities: string[];
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export function FilterBar({ filters, cities, onChange, onReset }: FilterBarProps) {
  const patch = (partial: Partial<SearchFilters>) =>
    onChange({ ...filters, ...partial });

  const togglePropertyType = (type: PropertyType) => {
    const set = new Set(filters.propertyTypes);
    if (set.has(type)) set.delete(type);
    else set.add(type);
    patch({ propertyTypes: [...set] });
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Filtros</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-brand-600 hover:underline"
        >
          Limpiar
        </button>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">Ciudad</legend>
        <select
          value={filters.city}
          onChange={(e) => patch({ city: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">
          Tipo de propiedad
        </legend>
        <ul className="space-y-2">
          {ALL_PROPERTY_TYPES.map((type) => (
            <li key={type}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.propertyTypes.includes(type)}
                  onChange={() => togglePropertyType(type)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                {PROPERTY_TYPE_LABELS[type]}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="col-span-2 mb-2 text-sm font-semibold text-slate-800">
          Precio (mín / máx)
        </legend>
        <input
          type="number"
          placeholder="Mín"
          value={filters.priceMin ?? ""}
          onChange={(e) =>
            patch({
              priceMin: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Máx"
          value={filters.priceMax ?? ""}
          onChange={(e) =>
            patch({
              priceMax: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">
          Ambientes y dormitorios
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-slate-500">
            Mín. ambientes
            <input
              type="number"
              min={0}
              value={filters.roomsMin ?? ""}
              onChange={(e) =>
                patch({
                  roomsMin: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-slate-500">
            Mín. dormitorios
            <input
              type="number"
              min={0}
              value={filters.bedroomsMin ?? ""}
              onChange={(e) =>
                patch({
                  bedroomsMin: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-800">
          Superficie (m²)
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-slate-500">
            Mín. cubiertos
            <input
              type="number"
              min={0}
              value={filters.coveredAreaMin ?? ""}
              onChange={(e) =>
                patch({
                  coveredAreaMin: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-slate-500">
            Mín. totales
            <input
              type="number"
              min={0}
              value={filters.totalAreaMin ?? ""}
              onChange={(e) =>
                patch({
                  totalAreaMin: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
}
