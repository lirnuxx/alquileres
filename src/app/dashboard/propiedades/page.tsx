import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProperties } from "@/lib/property-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PropertyTable } from "./PropertyTable";

export default function PropertiesListPage() {
  const properties = getAllProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Propiedades</h1>
          <p className="text-sm text-slate-500">
            {properties.length} propiedades en total
          </p>
        </div>
        <Link href="/dashboard/propiedades/nueva">
          <Button>
            <Plus className="h-4 w-4" />
            Nueva propiedad
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Todas las propiedades</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PropertyTable properties={properties} />
        </CardContent>
      </Card>
    </div>
  );
}
