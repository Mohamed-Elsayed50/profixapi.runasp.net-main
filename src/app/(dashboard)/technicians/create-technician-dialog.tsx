"use client";

import { useState } from "react";
import { Loader2, WrenchIcon } from "lucide-react";
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
import {
  useCreateTechnician,
  type CreateTechnicianPayload,
} from "@/src/hooks/use-technicians";
import { useTechnicianTypes } from "@/src/hooks/use-technician-types";

interface CreateTechnicianDialogProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL: CreateTechnicianPayload = {
  UserName: "",
  Email: "",
  Password: "",
  FullName: "",
  PhoneNumber: "",
  TechnicianTypeId: "",
  City: "",
};

export function CreateTechnicianDialog({
  open,
  onClose,
}: CreateTechnicianDialogProps) {
  const { mutate: create, isPending, error } = useCreateTechnician();
  const { data: techTypes } = useTechnicianTypes();
  const [form, setForm] = useState<CreateTechnicianPayload>(INITIAL);

  const set = (field: keyof CreateTechnicianPayload, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleClose = () => {
    setForm(INITIAL);
    onClose();
  };

  const handleSubmit = () => {
    create(form, { onSuccess: handleClose });
  };

  const isValid =
    form.UserName.trim() &&
    form.Email.trim() &&
    form.Password.trim() &&
    form.FullName.trim() &&
    form.TechnicianTypeId.trim();

  const textFields: {
    key: keyof CreateTechnicianPayload;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }[] = [
    { key: "FullName", label: "Full Name", required: true, placeholder: "Ahmed Hassan" },
    { key: "UserName", label: "Username", required: true, placeholder: "ahmedhassan" },
    { key: "Email", label: "Email", type: "email", required: true, placeholder: "ahmed@example.com" },
    { key: "Password", label: "Password", type: "password", required: true, placeholder: "••••••••" },
    { key: "PhoneNumber", label: "Phone Number", type: "tel", placeholder: "+1 234 567 890" },
    { key: "City", label: "City", placeholder: "Cairo" },
  ];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogHeader onClose={handleClose}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <WrenchIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <DialogTitle>Add New Technician</DialogTitle>
            <DialogDescription>
              Fill in the details to register a new technician account.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textFields.map(({ key, label, type, required, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`create-tech-${key}`}>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </Label>
              <Input
                id={`create-tech-${key}`}
                type={type ?? "text"}
                value={(form[key] as string) ?? ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                disabled={isPending}
              />
            </div>
          ))}

          {/* Technician Type — required */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="create-tech-type">
              Specialization (Type)
              <span className="ml-1 text-red-500">*</span>
            </Label>
            <select
              id="create-tech-type"
              value={form.TechnicianTypeId}
              onChange={(e) => set("TechnicianTypeId", e.target.value)}
              disabled={isPending}
              className="
                w-full rounded-lg border border-slate-200 bg-white px-3 py-2
                text-sm text-slate-700 shadow-sm outline-none
                focus:border-amber-400 focus:ring-2 focus:ring-amber-200
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              <option value="">— Select a type —</option>
              {Array.isArray(techTypes) &&
                techTypes.map((t: { id: string; name: string }) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <ErrorMessage error={error} defaultMessage="Failed to create technician. Please try again." />
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
          disabled={isPending || !isValid}
          className="bg-amber-500 text-white hover:bg-amber-600 border-transparent"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Creating…
            </>
          ) : (
            "Create Technician"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
