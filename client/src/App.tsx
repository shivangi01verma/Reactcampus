import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/features/auth/services/authApi';
import { ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((data) => setAuth(data.user, data.permissions))
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setLoading(false);
      });
  }, [setAuth, setLoading]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer />
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
