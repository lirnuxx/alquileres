import { getAllProperties } from "@/lib/property-service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
} from "lucide-react";

export default function EstadisticasPage() {
  const properties = getAllProperties();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Estadísticas</h1>
        <p className="text-sm text-slate-500">
          Reportes y métricas de tus propiedades
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
              <Eye className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Vistas totales</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Leads recibidos</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tasa de conversión</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
          <CardDescription>
            Las estadísticas detalladas estarán disponibles en una próxima
            actualización (Fase 5 del roadmap). Incluirán:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            <li>Vistas por propiedad (gráfico de línea temporal)</li>
            <li>Leads generados por propiedad</li>
            <li>Tasa de conversión (visita → lead)</li>
            <li>Comparativa entre meses</li>
            <li>Exportación a CSV</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
