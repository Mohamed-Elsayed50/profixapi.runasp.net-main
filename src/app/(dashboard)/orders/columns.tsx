"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { useCompleteRequest, useCancelRequest, useDeleteRequest } from "@/src/hooks/use-orders";

type Order = {
  id: string;
  title?: string;
  description?: string;
  technicianId?: string;
  status?: string;
  priority?: string;
  scheduledDate?: string;
};

const OrderActions = ({ requestId, status }: { requestId: string; status?: string }) => {
  const { mutate: completeRequest, isPending: isCompleting } = useCompleteRequest();
  const { mutate: cancelRequest, isPending: isCanceling } = useCancelRequest();
  const { mutate: deleteRequest, isPending: isDeleting } = useDeleteRequest();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => completeRequest(requestId)}
        disabled={isCompleting || isCanceling || isDeleting || status === "Completed"}
        className={`text-xs cursor-pointer px-2 py-1 rounded transition-all disabled:opacity-50 ${status === "Completed"
          ? "text-amber-700 border border-amber-500"
          : "border border-black hover:bg-slate-100 text-black"
          }`}
      >
        Complete
      </button>
      <button
        onClick={() => cancelRequest(requestId)}
        disabled={isCompleting || isCanceling || isDeleting || status === "Cancelled"}
        className={`text-xs px-2 py-1 cursor-pointer rounded transition-all disabled:opacity-50 ${status === "Cancelled"
          ? "text-amber-700 border border-amber-500"
          : "border border-black hover:bg-slate-100 text-black"
          }`}
      >
        Cancel
      </button>
      <button
        onClick={() => deleteRequest(requestId)}
        disabled={isCompleting || isCanceling || isDeleting}
        className="text-xs cursor-pointer border border-black px-2 py-1 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[200px] truncate">
          {description || "No description"}
        </div>
      );
    },
  },
  {
    accessorKey: "technicianId",
    header: "Technician ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={
          status === "Completed" ? "bg-green-100 text-green-700" :
            status === "Pending" ? "bg-amber-100 text-amber-700" :
              status === "InProgress" ? "bg-blue-100 text-blue-700" :
                status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
        }>
          {status || "Unknown"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const priorityLower = priority?.toLowerCase();
      return (
        <Badge className={
          priorityLower === "high" ? "bg-red-100 text-red-700" :
            priorityLower === "medium" ? "bg-amber-100 text-amber-700" :
              priorityLower === "low" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
        }>
          {priority || "Normal"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "scheduledDate",
    header: "Scheduled Date",
    cell: ({ row }) => {
      const date = row.getValue("scheduledDate") as string;
      return date ? new Date(date).toLocaleDateString() : "Not scheduled";
    },
  },
  {
    id: "actions",
    header: "Management",
    cell: ({ row }) => {
      const requestId = row.original.id;
      const status = row.original.status;
      return <OrderActions requestId={requestId} status={status} />;
    },
  },
];