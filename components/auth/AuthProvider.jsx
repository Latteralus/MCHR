import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const isLoading = status === 'loading';
  const router = useRouter();

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/forgot-password', '/reset-password'];
  const isPublicPath = publicPaths.includes(router.pathname);

  // Set the user from the session
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  // Handle authentication redirects
  useEffect(() => {
    if (!isLoading) {
      if (!session && !isPublicPath) {
        // Redirect to login if trying to access a protected route without being logged in
        router.push(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
      } else if (session && isPublicPath && router.pathname !== '/reset-password') {
        // Redirect to dashboard if already logged in and trying to access a public page
        router.push('/');
      }
    }
  }, [isLoading, session, isPublicPath, router]);

  // Function to check user permissions
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'admin': 4,
      'hr_manager': 3,
      'department_head': 2,
      'employee': 1
    };
    
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };
  
  // Function to check if user has access to a department
  const hasDepartmentAccess = (departmentId) => {
    if (!user) return false;
    
    // Admins and HR managers have access to all departments
    if (user.role === 'admin' || user.role === 'hr_manager') {
      return true;
    }
    
    // Department heads can only access their own department
    if (user.role === 'department_head') {
      return user.departmentId === departmentId;
    }
    
    // Employees can only access their own data, handled separately
    return false;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
    hasDepartmentAccess
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}