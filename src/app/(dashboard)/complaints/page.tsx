"use client";

import { columns } from "./columns";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/src/components/style/table/data-table";
import { useCustomers } from "@/src/hooks/use-customers";

export default function CustomersPage() {
  const { data, isLoading, error } = useCustomers();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading complaints.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Complaints</h2>
          <p className="text-slate-500">Manage and view all your registered complaints.</p>
        </div>
      </div>

      <DataTable columns={columns} data={data || []} />
    </div>
  );
}