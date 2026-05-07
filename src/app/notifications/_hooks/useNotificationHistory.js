import { useQuery } from '@tanstack/react-query';
import notificationService from '@/lib/services/notificationService';

export const useNotificationHistory = ({ userId, page, fromDate, toDate }) => {
  return useQuery({
    queryKey: ['notification-history', userId, page, fromDate, toDate],
    enabled: Boolean(userId),
    queryFn: async () => {
      return notificationService.getAll({
        id_pasien: userId,
        fromDate,
        toDate,
        page,
        perPage: 20,
      });
    },
    keepPreviousData: true,
    staleTime: 5000,
  });
};