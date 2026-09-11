import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'
import { Toaster } from 'react-hot-toast'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: '#1E1F26',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          },
          success: {
            iconTheme: { primary: '#2ED47A', secondary: '#15161C' },
            style: { borderLeft: '3px solid #2ED47A' } as React.CSSProperties,
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            style: { borderLeft: '3px solid #ef4444' } as React.CSSProperties,
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
)
