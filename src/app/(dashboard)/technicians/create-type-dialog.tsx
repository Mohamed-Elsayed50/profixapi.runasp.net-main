"use client";

import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ErrorMessage } from "@/src/components/ui/error-message";
import { useCreateTechnicianType } from "@/src/hooks/use-technician-types";

interface CreateTypeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTypeDialog({ open, onClose }: CreateTypeDialogProps) {
  const { mutate: create, isPending, error } = useCreateTechnicianType();
  const [name, setName] = useState("");

  const handleClose = () => {
    setName("");
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    create(name.trim(), { onSuccess: handleClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-sm">
      <DialogHeader onClose={handleClose}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <PlusCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <DialogTitle>Add Technician Type</DialogTitle>
            <DialogDescription>
              Create a new specialization category for technicians.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogBody>
        <div className="space-y-1.5">
          <Label htmlFor="create-type-name">
            Type Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="create-type-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electrician, Plumber…"
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>

        <ErrorMessage error={error} defaultMessage="Failed to create type. Please try again." />
      </DialogBody>

      <DialogFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || !name.trim()}
          className="bg-amber-500 text-white hover:bg-amber-600 border-transparent"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Creating…
            </>
          ) : (
            "Create Type"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
