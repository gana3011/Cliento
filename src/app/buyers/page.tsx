import Buyer from "./Buyer";
import { prisma } from "@/app/lib/prisma";

export default async function Page() {
  let data = [];

  try {
    data = await prisma.buyer.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log(data);
  } catch (error) {
    console.error("Error fetching buyers:", error);
  }

  return <Buyer data={data} />;
}
