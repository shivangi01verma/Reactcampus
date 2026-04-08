import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { GuestGuard } from '@/components/guards/GuestGuard';
import { publicRoutes } from './publicRoutes';
import { adminRoutes } from './adminRoutes';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));

export const router = createBrowserRouter([
  publicRoutes,
  adminRoutes,
  {
    element: <GuestGuard />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
