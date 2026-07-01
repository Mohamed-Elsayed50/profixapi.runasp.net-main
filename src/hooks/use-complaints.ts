import { useQuery } from "@tanstack/react-query";

export const useComplaints = () => {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      // Mocked since the endpoint doesn't exist on the new backend
      return [];
    },
  });
};