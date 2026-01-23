"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/context";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // Data stays fresh for 30 seconds
            gcTime: 1000 * 60 * 10, // Cache persists for 10 minutes
            refetchOnWindowFocus: true, // Refetch when window gains focus
            refetchOnMount: true, // Refetch when component mounts
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
