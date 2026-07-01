"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  confirmLabel?: string;
}

/**
 * Reusable confirmation dialog — used before destructive actions (delete).
 *
 * Usage:
 *   <ConfirmDialog
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onConfirm={handleDelete}
 *     title="Delete Customer"
 *     description="This action cannot be undone."
 *     isLoading={isPending}
 *   />
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  isLoading = false,
  confirmLabel = "Delete",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="max-w-sm">
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogBody className="py-3">
        <p className="text-sm text-slate-600">
          Are you sure you want to proceed? This action is{" "}
          <strong className="text-red-600">permanent</strong> and cannot be
          reversed.
        </p>
      </DialogBody>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-red-600 text-white hover:bg-red-700 border-transparent"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Deleting…
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
