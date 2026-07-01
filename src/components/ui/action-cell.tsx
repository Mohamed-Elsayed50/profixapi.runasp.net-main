"use client";

import { CheckCircle2, Lock, Pencil, Trash2 } from "lucide-react";

interface ActionCellProps {
  onEdit: () => void;
  onDelete: () => void;
  onVerify?: () => void;
  isVerified?: boolean;
  isVerifying?: boolean;
}

/**
 * Reusable action cell for data tables.
 * Renders a pencil (edit) icon and a trash (delete) icon.
 *
 * Usage in columns:
 *   cell: ({ row }) => (
 *     <ActionCell
 *       onEdit={() => onEdit(row.original)}
 *       onDelete={() => onDelete(row.original)}
 *     />
 *   ),
 */
export function ActionCell({ onEdit, onDelete, onVerify, isVerified = false, isVerifying = false }: ActionCellProps) {
  return (
    <div className="flex items-center gap-2">
      {!isVerified && onVerify ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVerify();
          }}
          className="group flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-150 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          title="Verify"
          aria-label="Verify"
          disabled={isVerifying}
        >
          {isVerifying ? <CheckCircle2 className="h-3.5 w-3.5 animate-pulse" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        </button>
      ) : null}

      {isVerified ? (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600" title="Verified">
          <Lock className="h-3.5 w-3.5" />
        </div>
      ) : null}

      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="
          group flex h-8 w-8 items-center justify-center rounded-lg
          border border-slate-200 bg-white text-slate-500
          transition-all duration-150
          hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        "
        title="Edit"
        aria-label="Edit"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="
          group flex h-8 w-8 items-center justify-center rounded-lg
          border border-slate-200 bg-white text-slate-500
          transition-all duration-150
          hover:border-red-300 hover:bg-red-50 hover:text-red-600
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
        "
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
