import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500">
          Administrá los datos de tu inmobiliaria
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil de la inmobiliaria</CardTitle>
          <CardDescription>
            Esta información se muestra en las fichas de tus propiedades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue="Inmobiliaria Sur" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug / Subdominio</Label>
              <Input id="slug" defaultValue="inmobiliaria-sur" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Dominio personalizado (opcional)</Label>
            <Input
              id="domain"
              placeholder="tudominio.com"
              defaultValue=""
            />
            <p className="text-xs text-slate-500">
              En producción, configurá un dominio personalizado vía CNAME.
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled>
              Guardar (próximamente)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan actual</CardTitle>
          <CardDescription>
            Estás en el plan FREE. Actualizá para acceder a más funcionalidades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-600">
              La integración con MercadoPago para suscripciones estará disponible
              en la Fase 5 del roadmap.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
