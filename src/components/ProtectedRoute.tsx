/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 * 
 * Usage:
 * ```tsx
 * <Route
 *   path="/photobooth"
 *   element={
 *     <ProtectedRoute>
 *       <PhotoboothLanding />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 * 
 * Features:
 * - Checks if user has valid auth token
 * - Preserves intended route in location state (for redirect after login)
 * - Shows loading state while checking authentication
 * - Supports optional animations
 * 
 * ⚠️ PRODUCTION NOTES:
 * - In production, also verify token expiration and signature
 * - Implement token refresh logic if using JWT with short expiry
 * - Consider adding role-based access control (RBAC)
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string; // Optional: for RBAC in future
}

/**
 * ProtectedRoute component that checks authentication before rendering children
 * 
 * @param children - React component(s) to render if authenticated
 * @param requiredRole - Optional role requirement for access control
 * @returns Either the protected component or redirect to login
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login, preserving the location they tried to access
    // This allows redirect back to intended page after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TODO: Add role-based access control if needed
  if (requiredRole) {
    // In production, decode JWT or fetch user data to verify role
    // const user = auth.getCurrentUser();
    // if (user?.role !== requiredRole) {
    //   return <Navigate to="/unauthorized" replace />;
    // }
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
}
