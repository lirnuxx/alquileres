# SPEC.md — Plataforma de Búsqueda Inmobiliaria (estilo Booking)

> Especificación técnica v1.0 — Documento vivo, actualizar a medida que el proyecto avance.

## 1. Resumen del proyecto

Plataforma de búsqueda de propiedades (alquiler/venta) con UX estilo Booking/Airbnb: filtros avanzados, geolocalización ("cerca de mí"), vista grilla + mapa. Modelo de negocio **SaaS multi-tenant**: cada inmobiliaria tiene su propio portal con marca propia, corriendo sobre una plataforma central. Opcionalmente, las propiedades de todos los tenants alimentan un buscador agregado (efecto red).

**Objetivo de negocio:** vender el software como suscripción a inmobiliarias chicas/medianas (modelo similar a Tokko Broker, pero con foco en la experiencia de búsqueda del usuario final).

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión objetivo | Por qué |
|---|---|---|---|
| Frontend | Next.js (App Router) + React | Next.js 16.x / React 19.x | SSR/SSG para SEO real; es el framework con más soporte y documentación hoy |
| Estilos | Tailwind CSS + shadcn/ui | — | Velocidad de desarrollo, componentes accesibles por defecto |
| Backend | Next.js API Routes / Server Actions (fase 1-2) → NestJS dedicado (fase 3+) | Node 22 LTS | Arrancar simple, separar API cuando el multi-tenant y la app móvil lo justifiquen |
| Base de datos | PostgreSQL + extensión PostGIS | Postgres 16+ | PostGIS resuelve nativamente las consultas geográficas ("cerca de mí") |
| ORM | Prisma | — | Migraciones tipadas, buena curva de aprendizaje |
| Buscador / filtros | Meilisearch | Cloud o self-hosted | Soporta geosearch y **tokens de tenant aislados** (clave para el multi-tenant), mucho más barato que Algolia |
| Mapas | Mapbox | — | Mejor free tier que Google Maps Platform para este volumen |
| Imágenes | Cloudinary | — | Optimización y resize automático de fotos |
| Auth | Clerk o Supabase Auth | — | Multi-tenant y roles resueltos sin programarlo desde cero |
| Pagos (suscripciones SaaS) | MercadoPago (Suscripciones / Planes) | API Checkout Pro + Preapproval | Necesario en Argentina; soporta cobros recurrentes |
| Hosting MVP | Vercel (frontend) + Supabase/Railway (DB) | — | Cero DevOps para arrancar |
| Notificaciones | Resend (email) | — | Alertas de búsquedas guardadas |
| Monorepo (fase 3+) | Turborepo | — | Cuando se separen apps/web, apps/api, apps/mobile |

---

## 3. Estructura de carpetas

Estructura para las fases 1-2 (un solo repo Next.js). En la fase 3 se migra a monorepo (ver nota al final).

```text
/src
  /app
    /(marketing)/              # landing pages públicas
    /(search)/
      page.tsx                 # home / buscador principal
      /propiedades/[id]/page.tsx
    /(auth)/
      /login/page.tsx
      /registro/page.tsx
    /(dashboard)/               # panel de la inmobiliaria (protegido, multi-tenant)
      /propiedades/
      /leads/
      /estadisticas/
      /configuracion/
    /api/
      /properties/route.ts
      /properties/[id]/route.ts
      /search/route.ts
      /tenants/[slug]/route.ts
      /favorites/route.ts
      /saved-searches/route.ts
      /leads/route.ts
      /subscriptions/checkout/route.ts
      /webhooks/mercadopago/route.ts
  /components
    /ui/                        # shadcn/ui
    /property/                  # PropertyCard, PropertyGallery, PropertyForm
    /search/                    # FilterBar, MapView, ResultsGrid
  /lib
    db.ts                       # cliente Prisma
    meilisearch.ts
    geo.ts                      # helpers de geolocalización
    auth.ts
  /server
    /actions/                   # server actions (mutaciones)
    /services/                  # lógica de negocio: propertyService, tenantService, leadService
  /types
  /styles
/prisma
  schema.prisma
  /migrations
/public
.env.example
```

---

## 4. Modelo de datos (Prisma schema)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  TENANT_ADMIN
  AGENT
  SEARCHER
}

enum OperationType {
  RENT
  SALE
}

enum PropertyType {
  APARTMENT
  HOUSE
  PH
  LAND
  OFFICE
  COMMERCIAL_LOCAL
}

enum PropertyStatus {
  ACTIVE
  PAUSED
  RENTED
  SOLD
}

enum PlanTier {
  FREE
  BASIC
  PRO
}

model Tenant {
  id           String    @id @default(cuid())
  name         String
  slug         String    @unique
  customDomain String?   @unique
  logoUrl      String?
  primaryColor String?
  planTier     PlanTier  @default(FREE)
  createdAt    DateTime  @default(now())

  users        User[]
  properties   Property[]
  subscription Subscription?
}

model User {
  id             String   @id @default(cuid())
  tenantId       String?
  tenant         Tenant?  @relation(fields: [tenantId], references: [id])
  email          String   @unique
  name           String?
  role           Role     @default(SEARCHER)
  authProviderId String?  @unique
  createdAt      DateTime @default(now())

  favorites      Favorite[]
  savedSearches  SavedSearch[]
}

model Property {
  id             String          @id @default(cuid())
  tenantId       String
  tenant         Tenant          @relation(fields: [tenantId], references: [id])
  title          String
  description    String
  operationType  OperationType
  propertyType   PropertyType
  status         PropertyStatus  @default(ACTIVE)
  price          Decimal
  currency       String          @default("ARS")
  coveredArea    Float?
  totalArea      Float?
  rooms          Int?
  bedrooms       Int?
  bathrooms      Int?
  ageYears       Int?
  expensasAmount Decimal?
  address        String
  neighborhood   String?
  city           String
  lat            Float
  lng            Float
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  images         PropertyImage[]
  amenities      PropertyAmenity[]
  favorites      Favorite[]
  leads          Lead[]

  @@index([tenantId])
  @@index([city, propertyType, operationType])
}

model PropertyImage {
  id         String   @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  url        String
  order      Int      @default(0)
  isCover    Boolean  @default(false)
}

model Amenity {
  id         String            @id @default(cuid())
  name       String            @unique
  properties PropertyAmenity[]
}

model PropertyAmenity {
  propertyId String
  amenityId  String
  property   Property @relation(fields: [propertyId], references: [id])
  amenity    Amenity  @relation(fields: [amenityId], references: [id])

  @@id([propertyId, amenityId])
}

model Favorite {
  userId     String
  propertyId String
  user       User     @relation(fields: [userId], references: [id])
  property   Property @relation(fields: [propertyId], references: [id])
  createdAt  DateTime @default(now())

  @@id([userId, propertyId])
}

model SavedSearch {
  id         String    @id @default(cuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id])
  name       String
  filters    Json
  alertsOn   Boolean   @default(false)
  lastSentAt DateTime?
  createdAt  DateTime  @default(now())
}

model Lead {
  id         String   @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  name       String
  email      String
  phone      String?
  message    String?
  createdAt  DateTime @default(now())
}

model Subscription {
  id               String    @id @default(cuid())
  tenantId         String    @unique
  tenant           Tenant    @relation(fields: [tenantId], references: [id])
  mercadoPagoSubId String?
  status           String
  currentPeriodEnd DateTime?
}
```

**Notas de diseño:**
- Todo lo que sea data de negocio (`Property`, `Lead`, `Subscription`) cuelga de `tenantId`. Toda query del backend debe filtrar por tenant — es la base del aislamiento multi-tenant.
- `lat`/`lng` en `Property` alimentan tanto PostGIS (consultas de respaldo/reportes) como el índice geo de Meilisearch (búsqueda rápida en producción).
- `filters` en `SavedSearch` se guarda como JSON para no tener que migrar el schema cada vez que se agrega un filtro nuevo.

---

## 5. Endpoints principales

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/search` | Público | Búsqueda vía Meilisearch: `operationType, propertyType, priceMin, priceMax, rooms, lat, lng, radiusKm, city, page` |
| GET | `/api/properties/:id` | Público | Ficha completa de una propiedad |
| GET | `/api/properties/:id/similar` | Público | Recomendaciones similares (mismo barrio/rango de precio) |
| POST | `/api/properties` | Tenant admin/agent | Crear propiedad |
| PATCH | `/api/properties/:id` | Tenant admin/agent | Editar propiedad |
| DELETE | `/api/properties/:id` | Tenant admin/agent | Baja lógica (status) |
| POST | `/api/properties/:id/images` | Tenant admin/agent | Subir imágenes (delegar a Cloudinary) |
| GET | `/api/tenants/:slug` | Público | Info pública del portal de la inmobiliaria (branding, propiedades) |
| PATCH | `/api/tenants/:id` | Tenant admin | Configuración y branding |
| GET/POST/DELETE | `/api/favorites` | Usuario autenticado | Gestión de favoritos |
| GET/POST/DELETE | `/api/saved-searches` | Usuario autenticado | Búsquedas guardadas + alertas |
| POST | `/api/leads` | Público | Formulario de contacto sobre una propiedad |
| GET | `/api/leads` | Tenant admin/agent | Leads recibidos por la inmobiliaria |
| POST | `/api/subscriptions/checkout` | Tenant admin | Inicia suscripción vía MercadoPago |
| POST | `/api/webhooks/mercadopago` | Webhook (firma verificada) | Actualiza estado de suscripción |
| GET | `/api/tenants/:id/stats` | Tenant admin (fase 3) | Visitas, leads generados, conversión |

---

## 6. Notas de arquitectura multi-tenant

- **Aislamiento de datos:** filtrado por `tenantId` en cada query (nivel aplicación) + considerar Row-Level Security de Postgres como capa extra de seguridad cuando haya más de un desarrollador tocando el código.
- **Búsqueda:** usar **tenant tokens** de Meilisearch para que cada portal individual solo pueda buscar dentro de sus propias propiedades, mientras el buscador agregado (opcional) usa la API key maestra.
- **Branding por tenant:** subdominio (`inmobiliaria.tuplataforma.com`) resuelto vía middleware de Next.js que lee el tenant desde el host y ajusta tema/logo dinámicamente.
- **Dominio propio (fase 3):** permitir que una inmobiliaria conecte su propio dominio vía CNAME + Vercel Domains API.

---

## 7. Variables de entorno (`.env.example`)

```env
DATABASE_URL=
NEXT_PUBLIC_MEILISEARCH_HOST=
MEILISEARCH_MASTER_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
CLOUDINARY_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
RESEND_API_KEY=
```

---

## 8. Fases de desarrollo

### Fase 0 — Setup (semana 1)
- [ ] Repo + CI (lint, type-check, tests en cada PR)
- [ ] Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Prisma + Postgres (Supabase) conectado
- [ ] Deploy esqueleto a Vercel

### Fase 1 — Core data + CRUD (semanas 2-3)
- [ ] Schema completo de Prisma + migraciones + seed data (propiedades de prueba)
- [ ] CRUD de propiedades sin auth todavía (panel interno simple)
- [ ] Subida de imágenes a Cloudinary

### Fase 2 — Búsqueda pública (semanas 4-6)
- [ ] Indexar propiedades en Meilisearch (incluye geo)
- [ ] Página de búsqueda: FilterBar + ResultsGrid + MapView (Mapbox)
- [ ] Geolocalización del navegador para "cerca de mí"
- [ ] Ficha de propiedad completa

### Fase 3 — Auth + multi-tenant (semanas 7-9)
- [ ] Integrar Clerk/Supabase Auth con roles
- [ ] Middleware de resolución de tenant por subdominio
- [ ] Aislamiento de datos por tenant en todas las queries
- [ ] Onboarding de la primera inmobiliaria piloto (datos reales)

### Fase 4 — Engagement (semanas 10-13)
- [ ] Favoritos y búsquedas guardadas
- [ ] Alertas por email (cron job diario contra Resend)
- [ ] Mensajería/leads con notificación a la inmobiliaria

### Fase 5 — Monetización (semanas 14-17)
- [ ] Planes (FREE/BASIC/PRO) y límites por plan
- [ ] Integración MercadoPago (Preapproval + webhook)
- [ ] Dashboard de estadísticas para cada inmobiliaria

### Fase 6 — Escala (mes 5+)
- [ ] Migrar a monorepo Turborepo si el equipo/carga lo justifica: `/apps/web`, `/apps/api` (NestJS), `/apps/mobile` (Expo/React Native), `/packages/database`, `/packages/ui`
- [ ] App móvil
- [ ] Expansión geográfica / más inmobiliarias

---

## 9. Consideraciones no funcionales

- **SEO:** SSR/SSG obligatorio en páginas de búsqueda y fichas de propiedad; sitemap dinámico por tenant.
- **Performance:** paginación cursor-based en `/api/search`; imágenes servidas en formatos modernos (WebP/AVIF) vía Cloudinary.
- **Seguridad:** validar `tenantId` en cada mutación server-side (nunca confiar en el que venga del cliente); rate limiting en `/api/leads` y `/api/search` para evitar scraping/spam.
- **Datos personales:** política de privacidad acorde a la Ley de Protección de Datos Personales (Argentina) — requiere revisión legal puntual antes de lanzar.
- **Calidad de listings:** validación básica anti-duplicados (por dirección + tenant) desde la fase 1.
