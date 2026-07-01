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
import { useUpdateCustomer, UpdateCustomerPayload } from "@/src/hooks/use-customers";
import type { Customer } from "./columns";

interface EditCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function EditCustomerDialog({
  open,
  onClose,
  customer,
}: EditCustomerDialogProps) {
  const { mutate: update, isPending } = useUpdateCustomer();

  const [form, setForm] = useState<Omit<UpdateCustomerPayload, "ProfileImage">>(() => ({
    FullName: customer?.fullName ?? "",
    Email: customer?.email ?? "",
    PhoneNumber: customer?.phoneNumber ?? "",
    Address: customer?.address ?? "",
    City: customer?.city ?? "",
    Country: customer?.country ?? "",
  }));


  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!customer) return;
    update(
      { userId: customer.userId, payload: form },
      { onSuccess: onClose }
    );
  };

  const fields: { key: keyof typeof form; label: string; type?: string }[] = [
    { key: "FullName", label: "Full Name" },
    { key: "Email", label: "Email", type: "email" },
    { key: "PhoneNumber", label: "Phone Number", type: "tel" },
    { key: "Address", label: "Address" },
    { key: "City", label: "City" },
    { key: "Country", label: "Country" },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogDescription>
          Update details for{" "}
          <strong>{customer?.fullName ?? "this customer"}</strong>
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, type }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`edit-customer-${key}`}>{label}</Label>
              <Input
                id={`edit-customer-${key}`}
                type={type ?? "text"}
                value={(form[key] as string) ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={label}
                disabled={isPending}
              />
            </div>
          ))}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
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
