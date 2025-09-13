import { prisma } from "@/app/lib/prisma";
import Buyer from "./Buyer";
import { Prisma, City, PropertyType, Status, Timeline } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    city?: City;
    propertyType?: PropertyType;
    status?: Status;
    timeline?: Timeline;
  }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const pageSize = 10;
  const page = parseInt(searchParams.page || "1", 10);

  const q = searchParams.q?.trim() || "";

  const where: Prisma.BuyerWhereInput = {
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),

    ...(searchParams.city ? { city: searchParams.city } : {}),
    ...(searchParams.propertyType ? { propertyType: searchParams.propertyType } : {}),
    ...(searchParams.status ? { status: searchParams.status } : {}),
    ...(searchParams.timeline ? { timeline: searchParams.timeline } : {}),
  };

  const [buyers, totalCount] = await Promise.all([
    prisma.buyer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.buyer.count({ where }),
  ]);

  return (
    <Buyer
      data={buyers}
      total={totalCount}
      page={page}
      pageSize={pageSize}
      searchParams={searchParams}
    />
  );
}
