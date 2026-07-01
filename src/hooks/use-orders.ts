import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// ─── Queries ──────────────────────────────────────────────────────────────────

// Get all service requests
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiClient.get("/api/ServiceRequest");
      // API returns a plain array, not wrapped in { data: [...] }
      return Array.isArray(res.data) ? res.data : (res.data?.data || []);
    },
  });
};

// Get my service requests (for logged-in user)
export const useMyRequests = () => {
  return useQuery({
    queryKey: ["my-requests"],
    queryFn: async () => {
      const res = await apiClient.get("/api/ServiceRequest/MyRequests");
      return Array.isArray(res.data) ? res.data : (res.data?.data || []);
    },
  });
};

// Get single service request by ID
export const useRequestById = (id: string) => {
  return useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/ServiceRequest/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────


// Complete a service request
export const useCompleteRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.put(`/api/ServiceRequest/Complete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
};

// Cancel a service request
export const useCancelRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.put(`/api/ServiceRequest/Cancel/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
};

// Delete a service request
export const useDeleteRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/api/ServiceRequest/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
  });
};