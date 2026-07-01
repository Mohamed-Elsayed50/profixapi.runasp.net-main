"use client";

import { useState, useMemo, useCallback } from "react";
import { Loader2, Wrench, ListTree } from "lucide-react";
import { DataTable } from "@/src/components/style/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { useTechnicians, useDeleteTechnician, useVerifyTechnician } from "@/src/hooks/use-technicians";
import { useTechnicianTypes, useDeleteTechnicianType } from "@/src/hooks/use-technician-types";
import { createTechnicianColumns, type Technician } from "./columns";
import { createTypeColumns, type TechnicianType } from "./type-columns";
import { EditTechnicianDialog } from "./edit-technician-dialog";
import { EditTypeDialog } from "./edit-type-dialog";
import { CreateTechnicianDialog } from "./create-technician-dialog";
import { CreateTypeDialog } from "./create-type-dialog";
import { Button } from "@/src/components/ui/button";
import { UserPlus, PlusCircle } from "lucide-react";

export default function TechniciansPage() {
  const techniciansQuery = useTechnicians();
  const typesQuery = useTechnicianTypes();
  const { mutate: deleteTechnician, isPending: isDeletingTech } = useDeleteTechnician();
  const { mutate: verifyTechnician, isPending: isVerifyingTech } = useVerifyTechnician();
  const { mutate: deleteType, isPending: isDeletingType } = useDeleteTechnicianType();

  // ── Technician dialog state ────────────────────────────────────────────────
  const [techCreateOpen, setTechCreateOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [techEditOpen, setTechEditOpen] = useState(false);
  const [techDeleteOpen, setTechDeleteOpen] = useState(false);

  // ── Technician Type dialog state ───────────────────────────────────────────
  const [typeCreateOpen, setTypeCreateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TechnicianType | null>(null);
  const [typeEditOpen, setTypeEditOpen] = useState(false);
  const [typeDeleteOpen, setTypeDeleteOpen] = useState(false);

  // ── Technician callbacks ───────────────────────────────────────────────────
  const handleTechEdit = useCallback((tech: Technician) => {
    setSelectedTech(tech);
    setTechEditOpen(true);
  }, []);

  const handleTechDeletePrompt = useCallback((tech: Technician) => {
    setSelectedTech(tech);
    setTechDeleteOpen(true);
  }, []);

  const handleTechDeleteConfirm = () => {
    if (!selectedTech) return;
    deleteTechnician(selectedTech.userId, {
      onSuccess: () => {
        setTechDeleteOpen(false);
        setSelectedTech(null);
      },
    });
  };

  const handleTechVerify = useCallback((tech: Technician) => {
    verifyTechnician({ userId: tech.userId, status: true });
  }, [verifyTechnician]);

  // ── Technician Type callbacks ──────────────────────────────────────────────
  const handleTypeEdit = useCallback((type: TechnicianType) => {
    setSelectedType(type);
    setTypeEditOpen(true);
  }, []);

  const handleTypeDeletePrompt = useCallback((type: TechnicianType) => {
    setSelectedType(type);
    setTypeDeleteOpen(true);
  }, []);

  const handleTypeDeleteConfirm = () => {
    if (!selectedType) return;
    deleteType(selectedType.id, {
      onSuccess: () => {
        setTypeDeleteOpen(false);
        setSelectedType(null);
      },
    });
  };

  // ── Memoized columns ───────────────────────────────────────────────────────
  const techColumns = useMemo(
    () =>
      createTechnicianColumns({
        onEdit: handleTechEdit,
        onDelete: handleTechDeletePrompt,
        onVerify: handleTechVerify,
        isVerifying: isVerifyingTech,
      }),
    [handleTechEdit, handleTechDeletePrompt, handleTechVerify, isVerifyingTech]
  );

  const typeColumns = useMemo(
    () =>
      createTypeColumns({
        onEdit: handleTypeEdit,
        onDelete: handleTypeDeletePrompt,
      }),
    [handleTypeEdit, handleTypeDeletePrompt]
  );

  const isLoading = techniciansQuery.isLoading || typesQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Technician Management</h2>
          <p className="text-slate-500">Manage technicians and their specialized types.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setTechCreateOpen(true)}
            className="bg-amber-500 text-white hover:bg-amber-600 border-transparent gap-2"
            size="sm"
          >
            <UserPlus className="h-4 w-4" />
            Add Technician
          </Button>
          <Button
            onClick={() => setTypeCreateOpen(true)}
            className="bg-amber-500 text-white hover:bg-amber-600 border-transparent gap-2"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Type
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-technicians" className="w-full">
        <TabsList className="bg-slate-100 w-full p-1 py-5 border border-slate-200">
          <TabsTrigger
            value="all-technicians"
            className="data-[state=active]:bg-white data-[state=active]:text-orange-500 cursor-pointer flex gap-4 py-3"
          >
            <Wrench className="h-4 w-4" />
            Technicians
          </TabsTrigger>
          <TabsTrigger
            value="tech-types"
            className="data-[state=active]:bg-white data-[state=active]:text-orange-500 cursor-pointer flex gap-2 py-3"
          >
            <ListTree className="h-4 w-4" />
            Technician Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-technicians" className="mt-6">
          <DataTable columns={techColumns} data={techniciansQuery.data || []} />
        </TabsContent>

        <TabsContent value="tech-types" className="mt-6">
          <DataTable columns={typeColumns} data={typesQuery.data || []} />
        </TabsContent>
      </Tabs>

      {/* ── Technician Dialogs ──────────────────────────────────────────────── */}
      <CreateTechnicianDialog
        open={techCreateOpen}
        onClose={() => setTechCreateOpen(false)}
      />

      <EditTechnicianDialog
        key={`tech-dialog-${selectedTech?.userId ?? "new"}-${techEditOpen}`}
        open={techEditOpen}
        onClose={() => {
          setTechEditOpen(false);
          setSelectedTech(null);
        }}
        technician={selectedTech}
      />

      <ConfirmDialog
        open={techDeleteOpen}
        onClose={() => {
          setTechDeleteOpen(false);
          setSelectedTech(null);
        }}
        onConfirm={handleTechDeleteConfirm}
        title="Delete Technician"
        description={`Delete "${selectedTech?.fullName}"? This cannot be undone.`}
        isLoading={isDeletingTech}
      />

      {/* ── Technician Type Dialogs ─────────────────────────────────────────── */}
      <CreateTypeDialog
        open={typeCreateOpen}
        onClose={() => setTypeCreateOpen(false)}
      />

      <EditTypeDialog
        key={`type-dialog-${selectedType?.id ?? "new"}-${typeEditOpen}`}
        open={typeEditOpen}
        onClose={() => {
          setTypeEditOpen(false);
          setSelectedType(null);
        }}
        technicianType={selectedType}
      />

      <ConfirmDialog
        open={typeDeleteOpen}
        onClose={() => {
          setTypeDeleteOpen(false);
          setSelectedType(null);
        }}
        onConfirm={handleTypeDeleteConfirm}
        title="Delete Technician Type"
        description={`Delete "${selectedType?.name}"? This cannot be undone.`}
        isLoading={isDeletingType}
      />
    </div>
  );
}