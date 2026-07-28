import { db } from "@/lib/db";

export default async function DashboardLeadsPage() {
  const leads = await db.lead.findMany({
    include: {
      property: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Consultas recibidas</h2>
        <p className="text-sm text-slate-600">
          Leads enviados desde el formulario de contacto en fichas públicas.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          Todavía no hay consultas. Aparecerán cuando alguien use &quot;Solicitar
          información&quot; en una propiedad.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  <p className="text-sm text-slate-600">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-sm text-slate-600">{lead.phone}</p>
                  )}
                </div>
                <time className="text-xs text-slate-400">
                  {lead.createdAt.toLocaleString("es-AR")}
                </time>
              </div>
              <p className="mt-2 text-sm font-medium text-brand-600">
                {lead.property.title}
              </p>
              {lead.message && (
                <p className="mt-2 text-sm text-slate-700">{lead.message}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
