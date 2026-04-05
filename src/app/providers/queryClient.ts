import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 60 s before background refetch. refetchOnWindowFocus
      // uses the React Query default (true) so admin tabs stay fresh on return.
      staleTime: 60_000,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
