
import type { Buyer as BuyerType } from "@prisma/client";
import Buyer from "./Buyer";
import { prisma } from "@/app/lib/prisma";

interface SearchParams {
  page?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  search?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  
  if (params.city) {
    where.city = params.city;
  }
  
  if (params.propertyType) {
    where.propertyType = params.propertyType;
  }
  
  if (params.status) {
    where.status = params.status;
  }
  
  if (params.timeline) {
    where.timeline = params.timeline;
  }
  
  // Search functionality
  if (params.search) {
    where.OR = [
      { fullName: { contains: params.search, mode: 'insensitive' } },
      { phone: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  let data: BuyerType[] = [];
  let total = 0;
  let filterOptions: any = {};

  try {
    // Fetch paginated data
    const [buyers, count, cities, propertyTypes, statuses, timelines] = await Promise.all([
      prisma.buyer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.buyer.count({ where }),
      prisma.buyer.groupBy({
        by: ['city'],
        _count: { city: true },
      }),
      prisma.buyer.groupBy({
        by: ['propertyType'],
        _count: { propertyType: true },
      }),
      prisma.buyer.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.buyer.groupBy({
        by: ['timeline'],
        _count: { timeline: true },
      }),
    ]);

    data = buyers;
    total = count;
    filterOptions = {
      cities: cities.map(c => c.city),
      propertyTypes: propertyTypes.map(p => p.propertyType),
      statuses: statuses.map(s => s.status),
      timelines: timelines.map(t => t.timeline),
    };
  } catch (error) {
    console.error("Error fetching buyers:", error);
  }

  return (
    <Buyer 
      data={data} 
      total={total}
      currentPage={page}
      pageSize={pageSize}
      filters={params}
      filterOptions={filterOptions}
    />
  );
}