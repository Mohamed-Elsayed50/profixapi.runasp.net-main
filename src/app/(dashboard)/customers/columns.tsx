"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ActionCell } from "@/src/components/ui/action-cell";

export type Customer = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string | null;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};

interface CreateColumnsOptions {
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const createCustomerColumns = ({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<Customer>[] => [
  {
    accessorKey: "profileImage",
    header: "Photo",
    size: 70,
    cell: ({ row }) => {
      const src = row.getValue("profileImage") as string | null;
      return src ? (
        <Image
          src={src}
          alt="profile"
          width={36}
          height={36}
          className="rounded-full object-cover border border-slate-200"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm border border-amber-200">
          {(row.getValue("fullName") as string)?.[0]?.toUpperCase() ?? "?"}
        </div>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    size: 180,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 220,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    size: 140,
    cell: ({ row }) =>
      row.getValue("phoneNumber") ?? (
        <span className="text-slate-400 text-xs">—</span>
      ),
  },
  {
    accessorKey: "address",
    header: "Address",
    size: 180,
    cell: ({ row }) =>
      row.getValue("address") ?? (
        <span className="text-slate-400 text-xs">—</span>
      ),
  },
  {
    accessorKey: "city",
    header: "City",
    size: 120,
    cell: ({ row }) =>
      row.getValue("city") ?? (
        <span className="text-slate-400 text-xs">—</span>
      ),
  },
  {
    accessorKey: "country",
    header: "Country",
    size: 120,
    cell: ({ row }) =>
      row.getValue("country") ?? (
        <span className="text-slate-400 text-xs">—</span>
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