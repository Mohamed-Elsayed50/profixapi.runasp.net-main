"use client";

import { useOrders } from "@/src/hooks/use-orders";
import { columns } from "./columns";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/src/components/style/table/data-table";

export default function OrdersPage() {
  const { data, isLoading } = useOrders();

  if (isLoading) return <Loader2 className="m-auto animate-spin text-amber-600" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Requests (Orders)</h1>
          <p className="text-slate-500">Manage and view all service requests.</p>
        </div>
      </div>

      <DataTable columns={columns} data={data || []} />
    </div>
  );
}