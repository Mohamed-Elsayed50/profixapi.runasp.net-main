import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpdateCustomerPayload {
  FullName?: string;
  PhoneNumber?: string;
  Email?: string;
  Address?: string;
  City?: string;
  Country?: string;
  Latitude?: number;
  Longitude?: number;
  ProfileImage?: File | null;
}

export interface CreateCustomerPayload {
  UserName: string;
  Email: string;
  Password: string;
  FullName: string;
  PhoneNumber?: string;
  Address?: string;
  City?: string;
  Country?: string;
  Latitude?: number;
  Longitude?: number;
  ProfileImage?: File | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await apiClient.get("/api/Customer");
      return res.data.data || res.data;
    },
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiClient.delete(`/api/Customer/Delete/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateCustomerPayload;
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
      const res = await apiClient.put(`/api/Customer/Update/${userId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCustomerPayload) => {
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
      const res = await apiClient.post("/api/Customer/Register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};