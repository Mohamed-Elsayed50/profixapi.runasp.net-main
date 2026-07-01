import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpdateTechnicianPayload {
  FullName?: string;
  PhoneNumber?: string;
  Email?: string;
  Latitude?: number;
  Longitude?: number;
  City?: string;
  TechnicianTypeId?: string;
  ProfileImage?: File | null;
  IsVerified?: boolean;
}

export interface CreateTechnicianPayload {
  UserName: string;
  Email: string;
  Password: string;
  FullName: string;
  PhoneNumber?: string;
  Latitude?: number;
  Longitude?: number;
  TechnicianTypeId: string;
  City?: string;
  ProfileImage?: File | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useTechnicians = () => {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const res = await apiClient.get("/api/Technician");
      const rawData = res.data?.data || res.data;

      if (Array.isArray(rawData)) {
        return rawData.map((technician: Record<string, unknown>) => ({
          ...technician,
          isVerified: technician.isVerified ?? technician.IsVerified ?? false,
        }));
      }

      return rawData;
    },
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useDeleteTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiClient.delete(`/api/Technician/Delete/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};

export const useVerifyTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: boolean }) => {
      const res = await apiClient.put(`/api/Technician/UpdateStatus/${userId}/${status}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};

export const useUpdateTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateTechnicianPayload;
    }) => {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            form.append(key, value);
          } else {
            form.append(key, String(value));
          }
        }
      });
      const res = await apiClient.put(
        `/api/Technician/Update/${userId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};

export const useCreateTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTechnicianPayload) => {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            form.append(key, value);
          } else {
            form.append(key, String(value));
          }
        }
      });
      const res = await apiClient.post("/api/Technician/Register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};

