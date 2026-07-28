import { db } from "@/lib/db";
import type {
  OperationType,
  Property,
  PropertyStatus,
  PropertyType,
} from "@/types/property";
import type {
  OperationType as PrismaOperationType,
  PropertyStatus as PrismaPropertyStatus,
  PropertyType as PrismaPropertyType,
  Property as PrismaProperty,
  PropertyImage,
  Tenant,
} from "@prisma/client";

type PropertyWithRelations = PrismaProperty & {
  tenant: Tenant;
  images: PropertyImage[];
};

export function mapProperty(record: PropertyWithRelations): Property {
  let amenities: string[] = [];
  try {
    amenities = JSON.parse(record.amenities) as string[];
  } catch {
    amenities = [];
  }

  return {
    id: record.id,
    tenantId: record.tenantId,
    tenantName: record.tenant.name,
    title: record.title,
    description: record.description,
    operationType: record.operationType as OperationType,
    propertyType: record.propertyType as PropertyType,
    status: record.status as PropertyStatus,
    price: record.price,
    currency: record.currency,
    coveredArea: record.coveredArea,
    totalArea: record.totalArea,
    rooms: record.rooms,
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    address: record.address,
    neighborhood: record.neighborhood,
    city: record.city,
    lat: record.lat,
    lng: record.lng,
    images: record.images
      .sort((a, b) => a.order - b.order)
      .map((img) => ({
        id: img.id,
        url: img.url,
        order: img.order,
        isCover: img.isCover,
      })),
    amenities,
  };
}

const include = { tenant: true, images: true } as const;

export async function listProperties(options?: {
  tenantId?: string;
  status?: PropertyStatus;
}): Promise<Property[]> {
  const records = await db.property.findMany({
    where: {
      ...(options?.tenantId ? { tenantId: options.tenantId } : {}),
      ...(options?.status ? { status: options.status as PrismaPropertyStatus } : {}),
    },
    include,
    orderBy: { createdAt: "desc" },
  });
  return records.map(mapProperty);
}

export async function listActiveProperties(): Promise<Property[]> {
  return listProperties({ status: "ACTIVE" });
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const record = await db.property.findUnique({ where: { id }, include });
  return record ? mapProperty(record) : null;
}

export interface PropertyInput {
  tenantId: string;
  title: string;
  description: string;
  operationType: OperationType;
  propertyType: PropertyType;
  status?: PropertyStatus;
  price: number;
  currency: string;
  coveredArea?: number | null;
  totalArea?: number | null;
  rooms?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  address: string;
  neighborhood?: string | null;
  city: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  amenities?: string[];
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  const record = await db.property.create({
    data: {
      tenantId: input.tenantId,
      title: input.title,
      description: input.description,
      operationType: input.operationType as PrismaOperationType,
      propertyType: input.propertyType as PrismaPropertyType,
      status: (input.status ?? "ACTIVE") as PrismaPropertyStatus,
      price: input.price,
      currency: input.currency,
      coveredArea: input.coveredArea ?? null,
      totalArea: input.totalArea ?? null,
      rooms: input.rooms ?? null,
      bedrooms: input.bedrooms ?? null,
      bathrooms: input.bathrooms ?? null,
      address: input.address,
      neighborhood: input.neighborhood ?? null,
      city: input.city,
      lat: input.lat,
      lng: input.lng,
      amenities: JSON.stringify(input.amenities ?? []),
      images: input.imageUrl
        ? {
            create: {
              url: input.imageUrl,
              order: 0,
              isCover: true,
            },
          }
        : undefined,
    },
    include,
  });
  return mapProperty(record);
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>
): Promise<Property> {
  const existing = await db.property.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) throw new Error("Propiedad no encontrada");

  await db.property.update({
    where: { id },
    data: {
      ...(input.title != null ? { title: input.title } : {}),
      ...(input.description != null ? { description: input.description } : {}),
      ...(input.operationType != null
        ? { operationType: input.operationType as PrismaOperationType }
        : {}),
      ...(input.propertyType != null
        ? { propertyType: input.propertyType as PrismaPropertyType }
        : {}),
      ...(input.status != null
        ? { status: input.status as PrismaPropertyStatus }
        : {}),
      ...(input.price != null ? { price: input.price } : {}),
      ...(input.currency != null ? { currency: input.currency } : {}),
      ...(input.coveredArea !== undefined ? { coveredArea: input.coveredArea } : {}),
      ...(input.totalArea !== undefined ? { totalArea: input.totalArea } : {}),
      ...(input.rooms !== undefined ? { rooms: input.rooms } : {}),
      ...(input.bedrooms !== undefined ? { bedrooms: input.bedrooms } : {}),
      ...(input.bathrooms !== undefined ? { bathrooms: input.bathrooms } : {}),
      ...(input.address != null ? { address: input.address } : {}),
      ...(input.neighborhood !== undefined
        ? { neighborhood: input.neighborhood }
        : {}),
      ...(input.city != null ? { city: input.city } : {}),
      ...(input.lat != null ? { lat: input.lat } : {}),
      ...(input.lng != null ? { lng: input.lng } : {}),
      ...(input.amenities != null
        ? { amenities: JSON.stringify(input.amenities) }
        : {}),
    },
    include,
  });

  if (input.imageUrl) {
    const cover = existing.images.find((i) => i.isCover) ?? existing.images[0];
    if (cover) {
      await db.propertyImage.update({
        where: { id: cover.id },
        data: { url: input.imageUrl },
      });
    } else {
      await db.propertyImage.create({
        data: {
          propertyId: id,
          url: input.imageUrl,
          order: 0,
          isCover: true,
        },
      });
    }
  }

  const refreshed = await db.property.findUnique({ where: { id }, include });
  if (!refreshed) throw new Error("Propiedad no encontrada");
  return mapProperty(refreshed);
}

export async function deleteProperty(id: string): Promise<void> {
  await db.property.delete({ where: { id } });
}

export async function getDefaultTenant() {
  return db.tenant.findFirst({ orderBy: { createdAt: "asc" } });
}

export async function getDistinctCities(): Promise<string[]> {
  const rows = await db.property.findMany({
    where: { status: "ACTIVE" },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return rows.map((r) => r.city);
}
