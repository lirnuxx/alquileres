import { SearchPageClient } from "@/components/search/SearchPageClient";
import { SEED_PROPERTIES } from "@/lib/seed-properties";

export default function HomePage() {
  return <SearchPageClient initialProperties={SEED_PROPERTIES} />;
}
