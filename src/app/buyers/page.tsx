import type { Buyer as BuyerType } from "@prisma/client";
import Buyer from "./Buyer";
import { prisma } from "@/app/lib/prisma";

export default async function Page() {
  let data: BuyerType[] = [];

  try {
    data = await prisma.buyer.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
  }

  return <Buyer data={data} />;
}