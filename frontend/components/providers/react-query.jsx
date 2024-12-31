// lib/providers/TanstackProvider.js
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

const TanstackProvider = ({ children }) => {
  // Initialize QueryClient only once using useState
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 60 * 2, // 2 hours
        refetchOnWindowFocus: false, // Prevent refetch on window focus globally
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Remove ReactQueryDevtools in production */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default TanstackProvider;
