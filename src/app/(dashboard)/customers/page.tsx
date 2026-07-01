"use client";

import { useState, useMemo, useCallback } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { DataTable } from "@/src/components/style/table/data-table";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { Button } from "@/src/components/ui/button";
import { useCustomers, useDeleteCustomer } from "@/src/hooks/use-customers";
import { createCustomerColumns, type Customer } from "./columns";
import { EditCustomerDialog } from "./edit-customer-dialog";
import { CreateCustomerDialog } from "./create-customer-dialog";

export default function CustomersPage() {
  const { data, isLoading, error } = useCustomers();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  // ── Dialog state ───────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ── Callbacks passed to columns factory ────────────────────────────────────
  const handleEdit = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setEditOpen(true);
  }, []);

  const handleDeletePrompt = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = () => {
    if (!selectedCustomer) return;
    deleteCustomer(selectedCustomer.userId, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedCustomer(null);
      },
    });
  };

  // ── Memoize columns so they're not recreated on every render ───────────────
  const columns = useMemo(
    () =>
      createCustomerColumns({
        onEdit: handleEdit,
        onDelete: handleDeletePrompt,
      }),
    [handleEdit, handleDeletePrompt]
  );

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading customers.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Customers
          </h2>
          <p className="text-slate-500">
            Manage and view all your registered customers.
          </p>
        </div>
        <Button
          id="btn-add-customer"
          onClick={() => setCreateOpen(true)}
          className="bg-amber-500 text-white hover:bg-amber-600 border-transparent gap-2"
          size="sm"
        >
          <UserPlus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <DataTable columns={columns} data={data || []} />

      {/* ── Create Dialog ─────────────────────────────────────────────────────── */}
      <CreateCustomerDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* ── Edit Dialog ─────────────────────────────────────────────────────── */}
      <EditCustomerDialog
        key={`${selectedCustomer?.userId ?? "new"}-${editOpen}`}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />

      {/* ── Delete Confirmation Dialog ───────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        description={`Delete "${selectedCustomer?.fullName}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}