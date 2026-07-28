import { getAllProperties } from "@/lib/property-service";
import {
  Building2,
  Home,
  Banknote,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const properties = getAllProperties();
  const active = properties.filter((p) => p.status === "ACTIVE");
  const rented = properties.filter((p) => p.status === "RENTED" || p.status === "SOLD");
  const forRent = active.filter((p) => p.operationType === "RENT");
  const forSale = active.filter((p) => p.operationType === "SALE");

  const stats = [
    {
      label: "Propiedades activas",
      value: active.length,
      icon: Building2,
      color: "text-brand-600",
      bg: "bg-brand-100",
    },
    {
      label: "En alquiler",
      value: forRent.length,
      icon: Home,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "En venta",
      value: forSale.length,
      icon: Banknote,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      label: "Operadas (alquiladas/vendidas)",
      value: rented.length,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Resumen de tu panel de propiedades
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas propiedades</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-slate-100">
              {properties.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">{p.title}</p>
                    <p className="text-sm text-slate-500">
                      {p.city}
                      {p.neighborhood && ` · ${p.neighborhood}`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {p.currency === "ARS" ? "$" : "US$"}
                    {p.price.toLocaleString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
            {properties.length > 5 && (
              <Link
                href="/dashboard/propiedades"
                className="mt-3 block text-center text-sm font-medium text-brand-600 hover:underline"
              >
                Ver todas las propiedades
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceso rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/propiedades/nueva"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-brand-500 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                <Building2 className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">
                  Publicar propiedad
                </p>
                <p className="text-sm text-slate-500">
                  Agregá una nueva propiedad al catálogo
                </p>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-brand-500 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Home className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Ver sitio público</p>
                <p className="text-sm text-slate-500">
                  Visitá el buscador como lo ve un usuario
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
