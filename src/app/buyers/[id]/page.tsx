import { prisma } from '@/app/lib/prisma';
import React from 'react'
import EditBuyer from './EditBuyer';


type Props = { params: Promise<{ id: string }> };

const page = async ({ params }: Props) => {
    const { id } = await params;

    const buyer = await prisma.buyer.findUnique({ where: {id},});

    if(!buyer) return <h1>No buyers...</h1>

    const history = await prisma.buyerHistory.findMany({
        where: {buyerId: id},
        orderBy: {changedAt: "desc"},
        take: 5
    });

  return (
    <div>
        <EditBuyer buyer={buyer} history={history} />
    </div>
  )
}

export default page