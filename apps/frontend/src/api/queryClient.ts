import { DefaultOptions, QueryClient } from '@tanstack/react-query';

const defaultOptionsConfig: DefaultOptions = {
  queries: {
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: defaultOptionsConfig,
});
