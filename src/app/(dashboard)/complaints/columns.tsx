"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";

type Complaint = {
  userId: { name: string };
  subject: string;
  status: string;
};

export const columns: ColumnDef<Complaint>[] = [
  {
    accessorKey: "userId.name",
    header: "Customer",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={
          status === "pending" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <button className="text-xs border border-black px-2 py-1 rounded hover:bg-slate-100">
        Resolve
      </button>
    ),
  },
];