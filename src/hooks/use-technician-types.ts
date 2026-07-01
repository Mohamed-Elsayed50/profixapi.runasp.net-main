import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useTechnicianTypes = () => {
  return useQuery({
    queryKey: ["technician-types"],
    queryFn: async () => {
      const res = await apiClient.get("/api/TechnicanType");
      return res.data.data || res.data;
    },
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useDeleteTechnicianType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/api/TechnicanType/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-types"] });
    },
  });
};

export const useUpdateTechnicianType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await apiClient.put(`/api/TechnicanType/${id}`, { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-types"] });
    },
  });
};

export const useCreateTechnicianType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient.post("/api/TechnicanType", { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-types"] });
    },
  });
};
