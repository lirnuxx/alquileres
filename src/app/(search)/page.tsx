import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import {
  getDistinctCities,
  listActiveProperties,
} from "@/server/services/propertyService";

export default async function SearchHomePage() {
  const [properties, cities] = await Promise.all([
    listActiveProperties(),
    getDistinctCities(),
  ]);

  return (
    <>
      <SearchPageClient initialProperties={properties} cities={cities} />
      <Link
        href="/dashboard"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800"
      >
        <LayoutDashboard className="h-4 w-4" />
        Panel
      </Link>
    </>
  );
}
