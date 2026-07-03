"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { ActionCell } from "@/src/components/ui/action-cell";

export type Technician = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string | null;
  city?: string;
  status?: string;
  isVerified?: boolean;
  technicianTypeName?: string;
  averageRating?: number;
  latitude?: number | null;
  longitude?: number | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface CreateColumnsOptions {
  onEdit: (technician: Technician) => void;
  onDelete: (technician: Technician) => void;
  onVerify: (technician: Technician) => void;
  isVerifying?: boolean;
}

export const createTechnicianColumns = ({
  onEdit,
  onDelete,
  onVerify,
  isVerifying = false,
}: CreateColumnsOptions): ColumnDef<Technician>[] => [
  {
    accessorKey: "profileImage",
    header: "Photo",
    size: 70,
    cell: ({ row }) => {
      const src = row.getValue("profileImage") as string | null;
      const fullSrc = src
        ? src.startsWith("http")
          ? src
          : `${BASE_URL}${src}`
        : null;
      return fullSrc ? (
        <Image
          src={fullSrc}
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
    accessorKey: "technicianTypeName",
    header: "Specialization",
    size: 140,
    cell: ({ row }) => {
      const val = row.getValue("technicianTypeName") as string;
      return val ? (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
          {val}
        </span>
      ) : (
        <span className="text-slate-400 text-xs">—</span>
      );
    },
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
    accessorKey: "averageRating",
    header: "Rating",
    size: 100,
    cell: ({ row }) => {
      const rating = row.getValue("averageRating") as number;
      return (
        <span className="font-medium text-amber-600">
          {"★".repeat(Math.round(rating))}
          {"☆".repeat(5 - Math.round(rating))}{" "}
          {rating > 0 ? `(${rating})` : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isAvailable = status?.toLowerCase() === "available";
      return (
        <Badge
          className={
            isAvailable ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          }
        >
          {status ?? "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    size: 110,
    cell: ({ row }) => {
      const isVerified = Boolean(row.getValue("isVerified"));
      return (
        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isVerified ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          <Lock className={`h-3.5 w-3.5 ${isVerified ? "" : "opacity-60"}`} />
          {isVerified ? "Verified" : "Pending"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    size: 120,
    cell: ({ row }) => (
      <ActionCell
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original)}
        onVerify={() => onVerify(row.original)}
        isVerified={Boolean(row.original.isVerified)}
        isVerifying={isVerifying}
      />
    ),
  },
];