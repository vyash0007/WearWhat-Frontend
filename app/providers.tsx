"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/lib/context";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
            gcTime: 1000 * 60 * 10, // Cache persists for 10 minutes
            refetchOnWindowFocus: false, // Don't refetch when window gains focus
            refetchOnMount: false, // Don't refetch when component mounts if data is fresh
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
