"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ActionCell } from "@/src/components/ui/action-cell";

export type TechnicianType = {
  id: string;
  name: string;
};

interface CreateTypeColumnsOptions {
  onEdit: (type: TechnicianType) => void;
  onDelete: (type: TechnicianType) => void;
}

export const createTypeColumns = ({
  onEdit,
  onDelete,
}: CreateTypeColumnsOptions): ColumnDef<TechnicianType>[] => [
  {
    accessorKey: "name",
    header: "Type Name",
    cell: ({ row }) => (
      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-500">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row }) => (
      <ActionCell
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original)}
      />
    ),
  },
];