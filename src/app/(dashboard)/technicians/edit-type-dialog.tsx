"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { useUpdateTechnicianType } from "@/src/hooks/use-technician-types";
import type { TechnicianType } from "./type-columns";

interface EditTypeDialogProps {
  open: boolean;
  onClose: () => void;
  technicianType: TechnicianType | null;
}

export function EditTypeDialog({
  open,
  onClose,
  technicianType,
}: EditTypeDialogProps) {
  const { mutate: update, isPending } = useUpdateTechnicianType();
  const [name, setName] = useState(() => technicianType?.name ?? "");


  const handleSubmit = () => {
    if (!technicianType || !name.trim()) return;
    update(
      { id: technicianType.id, name: name.trim() },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-sm">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Edit Technician Type</DialogTitle>
        <DialogDescription>
          Update the name for{" "}
          <strong>{technicianType?.name ?? "this type"}</strong>
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        <div className="space-y-1.5">
          <Label htmlFor="edit-type-name">Type Name</Label>
          <Input
            id="edit-type-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Plumber"
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>
      </DialogBody>

      <DialogFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
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
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
