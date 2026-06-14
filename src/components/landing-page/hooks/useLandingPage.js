import { useQuery } from '@tanstack/react-query';
import systemInfoService from '@/lib/services/systemInfoService';
import promoService from '@/lib/services/promoService';
import articleService from '@/lib/services/articleService';

// Standard cache duration: 5 minutes
const CACHE_TIME = 5 * 60 * 1000;

export const useSystemInfo = () => {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: systemInfoService.get,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled: typeof window !== 'undefined',
  });
};

export const usePublicPromos = () => {
  return useQuery({
    queryKey: ['publicPromos'],
    queryFn: promoService.getPublic,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled: typeof window !== 'undefined',
  });
};

export const usePublicArticles = () => {
  return useQuery({
    queryKey: ['publicArticles'],
    queryFn: articleService.getAll,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled: typeof window !== 'undefined',
  });
};
