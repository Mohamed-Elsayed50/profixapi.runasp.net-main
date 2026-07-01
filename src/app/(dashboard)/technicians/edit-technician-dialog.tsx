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
import {
  useUpdateTechnician,
  UpdateTechnicianPayload,
} from "@/src/hooks/use-technicians";
import { useTechnicianTypes } from "@/src/hooks/use-technician-types";
import type { Technician } from "./columns";

interface EditTechnicianDialogProps {
  open: boolean;
  onClose: () => void;
  technician: Technician | null;
}

export function EditTechnicianDialog({
  open,
  onClose,
  technician,
}: EditTechnicianDialogProps) {
  const { mutate: update, isPending } = useUpdateTechnician();
  const { data: techTypes } = useTechnicianTypes();

  const [form, setForm] = useState<Omit<UpdateTechnicianPayload, "ProfileImage">>(() => ({
    FullName: technician?.fullName ?? "",
    Email: technician?.email ?? "",
    PhoneNumber: technician?.phoneNumber ?? "",
    City: technician?.city ?? "",
    TechnicianTypeId: "",
  }));


  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!technician) return;
    // Strip empty strings so we don't send blank values
    const payload: UpdateTechnicianPayload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== "")
    );
    update({ userId: technician.userId, payload }, { onSuccess: onClose });
  };

  const textFields: {
    key: keyof Omit<UpdateTechnicianPayload, "ProfileImage" | "TechnicianTypeId">;
    label: string;
    type?: string;
  }[] = [
    { key: "FullName", label: "Full Name" },
    { key: "Email", label: "Email", type: "email" },
    { key: "PhoneNumber", label: "Phone Number", type: "tel" },
    { key: "City", label: "City" },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <DialogTitle>Edit Technician</DialogTitle>
        <DialogDescription>
          Update details for{" "}
          <strong>{technician?.fullName ?? "this technician"}</strong>
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textFields.map(({ key, label, type }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`edit-tech-${key}`}>{label}</Label>
              <Input
                id={`edit-tech-${key}`}
                type={type ?? "text"}
                value={(form[key] as string) ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={label}
                disabled={isPending}
              />
            </div>
          ))}

          {/* Technician Type Select */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="edit-tech-type">Specialization (Technician Type)</Label>
            <select
              id="edit-tech-type"
              value={form.TechnicianTypeId ?? ""}
              onChange={(e) => handleChange("TechnicianTypeId", e.target.value)}
              disabled={isPending}
              className="
                w-full rounded-lg border border-slate-200 bg-white px-3 py-2
                text-sm text-slate-700 shadow-sm outline-none
                focus:border-amber-400 focus:ring-2 focus:ring-amber-200
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              <option value="">— Keep current —</option>
              {Array.isArray(techTypes) &&
                techTypes.map((t: { id: string; name: string }) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
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
          disabled={isPending}
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
