"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
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
  useCreateCustomer,
  type CreateCustomerPayload,
} from "@/src/hooks/use-customers";

interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
}

const INITIAL: CreateCustomerPayload = {
  UserName: "",
  Email: "",
  Password: "",
  FullName: "",
  PhoneNumber: "",
  Address: "",
  City: "",
  Country: "",
};

export function CreateCustomerDialog({
  open,
  onClose,
}: CreateCustomerDialogProps) {
  const { mutate: create, isPending, error } = useCreateCustomer();
  const [form, setForm] = useState<CreateCustomerPayload>(INITIAL);

  const set = (field: keyof CreateCustomerPayload, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleClose = () => {
    setForm(INITIAL);
    onClose();
  };

  const handleSubmit = () => {
    create(form, { onSuccess: handleClose });
  };

  const isValid = form.UserName.trim() && form.Email.trim() && form.Password.trim() && form.FullName.trim();

  const fields: {
    key: keyof CreateCustomerPayload;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }[] = [
    { key: "FullName", label: "Full Name", required: true, placeholder: "John Doe" },
    { key: "UserName", label: "Username", required: true, placeholder: "johndoe" },
    { key: "Email", label: "Email", type: "email", required: true, placeholder: "john@example.com" },
    { key: "Password", label: "Password", type: "password", required: true, placeholder: "••••••••" },
    { key: "PhoneNumber", label: "Phone Number", type: "tel", placeholder: "+1 234 567 890" },
    { key: "Address", label: "Address", placeholder: "123 Main St" },
    { key: "City", label: "City", placeholder: "New York" },
    { key: "Country", label: "Country", placeholder: "USA" },
  ];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogHeader onClose={handleClose}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <UserPlus className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Fill in the details to register a new customer account.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, type, required, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`create-customer-${key}`}>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </Label>
              <Input
                id={`create-customer-${key}`}
                type={type ?? "text"}
                value={(form[key] as string) ?? ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                disabled={isPending}
              />
            </div>
          ))}
        </div>

        <ErrorMessage error={error} defaultMessage="Failed to create customer. Please try again." />
      </DialogBody>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={handleClose} disabled={isPending}>
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
            "Create Customer"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
