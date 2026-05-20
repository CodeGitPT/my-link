"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // 실시간(포커스) 갱신 비활성화
            refetchOnReconnect: false,   // 네트워크 재연결 시 갱신 비활성화
            staleTime: Infinity,         // 한 번 가져온 데이터를 자동으로 만료시키지 않음 (실시간성 제거)
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
