import { useQuery } from "@tanstack/react-query";
import notificationService from "@/lib/services/notificationService";
export const useNotification = (page, search) => {
  return useQuery({
    queryKey: ["notifications", page, search],
    queryFn: async () => {
      try {
        return await notificationService.getAll({ page: page, search: search });
      } catch (err) {
        console.error('notification fetch failed', err);
        // return empty shape so UI shows no-data instead of error screen
        return { data: [], meta: { totalItems: 0, totalPages: 1 } };
      }
    },
    keepPreviousData: true,
    staleTime: 5000,
  });
};  