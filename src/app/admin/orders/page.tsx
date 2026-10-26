import React from "react";
import prisma from "@/lib/prisma";
import AdminOrdersClient from "@/components/AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const rawOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const orders = rawOrders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  return <AdminOrdersClient initialOrders={orders} />;
}
