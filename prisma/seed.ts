import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED = [
  {
    title: "Departamento luminoso en Palermo",
    description:
      "Amplio 3 ambientes con balcón, cocina integrada y amenities en el edificio. A metros de Plaza Serrano.",
    operationType: "RENT" as const,
    propertyType: "APARTMENT" as const,
    price: 850000,
    currency: "ARS",
    coveredArea: 72,
    totalArea: 78,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    address: "Gorriti 4200",
    neighborhood: "Palermo",
    city: "Buenos Aires",
    lat: -34.5889,
    lng: -58.4306,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    amenities: ["Pileta", "SUM", "Seguridad 24h"],
  },
  {
    title: "Casa con jardín en San Isidro",
    description:
      "Casa de 4 ambientes en barrio residencial, garage para 2 autos y parrilla.",
    operationType: "SALE" as const,
    propertyType: "HOUSE" as const,
    price: 285000,
    currency: "USD",
    coveredArea: 180,
    totalArea: 420,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    address: "Av. del Libertador 15200",
    neighborhood: "San Isidro",
    city: "San Isidro",
    lat: -34.4732,
    lng: -58.5271,
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    amenities: ["Jardín", "Parrilla", "Garage"],
  },
  {
    title: "PH reciclado en Villa Crespo",
    description: "Dos plantas, patio propio y excelente conectividad con subte.",
    operationType: "SALE" as const,
    propertyType: "PH" as const,
    price: 195000,
    currency: "USD",
    coveredArea: 95,
    totalArea: 110,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    address: "Corrientes 5200",
    neighborhood: "Villa Crespo",
    city: "Buenos Aires",
    lat: -34.5985,
    lng: -58.437,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    amenities: ["Patio", "Terraza"],
  },
  {
    title: "Lote en country con acceso asfaltado",
    description: "Terreno de 800 m² en loteo cerrado con servicios y seguridad.",
    operationType: "SALE" as const,
    propertyType: "LAND" as const,
    price: 45000,
    currency: "USD",
    coveredArea: null,
    totalArea: 800,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    address: "Ruta 58 km 12",
    neighborhood: "Canning",
    city: "Ezeiza",
    lat: -34.855,
    lng: -58.512,
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    amenities: ["Seguridad", "Club house"],
  },
  {
    title: "Monoambiente en Microcentro",
    description: "Ideal inversión o primera vivienda, amoblado y listo para habitar.",
    operationType: "RENT" as const,
    propertyType: "APARTMENT" as const,
    price: 520000,
    currency: "ARS",
    coveredArea: 38,
    totalArea: 38,
    rooms: 1,
    bedrooms: 0,
    bathrooms: 1,
    address: "Reconquista 600",
    neighborhood: "Microcentro",
    city: "Buenos Aires",
    lat: -34.6037,
    lng: -58.3719,
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    amenities: ["Amoblado", "Laundry"],
  },
  {
    title: "Local a la calle en Belgrano",
    description: "Vidriera amplia, ideal gastronomía o retail. Expensas moderadas.",
    operationType: "RENT" as const,
    propertyType: "COMMERCIAL_LOCAL" as const,
    price: 1200000,
    currency: "ARS",
    coveredArea: 65,
    totalArea: 65,
    rooms: 2,
    bedrooms: null,
    bathrooms: 1,
    address: "Cabildo 2100",
    neighborhood: "Belgrano",
    city: "Buenos Aires",
    lat: -34.563,
    lng: -58.458,
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    amenities: ["Vidriera", "Depósito"],
  },
  {
    title: "Oficina premium en Puerto Madero",
    description: "Piso alto con vista al río, 3 privados y recepción.",
    operationType: "RENT" as const,
    propertyType: "OFFICE" as const,
    price: 2800,
    currency: "USD",
    coveredArea: 120,
    totalArea: 120,
    rooms: 4,
    bedrooms: null,
    bathrooms: 2,
    address: "Azucena Villaflor 400",
    neighborhood: "Puerto Madero",
    city: "Buenos Aires",
    lat: -34.611,
    lng: -58.362,
    imageUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    amenities: ["Cocheras", "Seguridad", "HVAC"],
  },
  {
    title: "Duplex en Nordelta",
    description: "4 ambientes en barrio cerrado, pileta comunitaria y canchas.",
    operationType: "SALE" as const,
    propertyType: "HOUSE" as const,
    price: 320000,
    currency: "USD",
    coveredArea: 145,
    totalArea: 220,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 3,
    address: "Los Castores 1200",
    neighborhood: "Nordelta",
    city: "Tigre",
    lat: -34.412,
    lng: -58.652,
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    amenities: ["Pileta", "Club house", "Seguridad"],
  },
];

async function main() {
  await prisma.lead.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.tenant.deleteMany();

  const tenant1 = await prisma.tenant.create({
    data: { name: "Inmobiliaria Sur", slug: "inmobiliaria-sur" },
  });
  const tenant2 = await prisma.tenant.create({
    data: { name: "Centro Propiedades", slug: "centro-propiedades" },
  });
  const tenant3 = await prisma.tenant.create({
    data: { name: "Delta Lotes", slug: "delta-lotes" },
  });

  const tenants = [tenant1, tenant1, tenant2, tenant3, tenant2, tenant3, tenant1, tenant2];

  for (let i = 0; i < SEED.length; i++) {
    const item = SEED[i];
    const tenant = tenants[i];
    await prisma.property.create({
      data: {
        tenantId: tenant.id,
        title: item.title,
        description: item.description,
        operationType: item.operationType,
        propertyType: item.propertyType,
        status: "ACTIVE",
        price: item.price,
        currency: item.currency,
        coveredArea: item.coveredArea,
        totalArea: item.totalArea,
        rooms: item.rooms,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        address: item.address,
        neighborhood: item.neighborhood,
        city: item.city,
        lat: item.lat,
        lng: item.lng,
        amenities: JSON.stringify(item.amenities),
        images: {
          create: {
            url: item.imageUrl,
            order: 0,
            isCover: true,
          },
        },
      },
    });
  }

  console.log(`Seed OK: ${SEED.length} propiedades, 3 inmobiliarias`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
