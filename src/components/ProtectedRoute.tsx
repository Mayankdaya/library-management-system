
'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const publicPaths = ['/login', '/signup', '/'];

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return null; // or a loading spinner
  }

  if (!user && !publicPaths.includes(pathname)) {
      return null;
  }
  
  if (user && publicPaths.includes(pathname) && pathname !== '/') {
    router.push('/catalog');
    return null;
  }

  return <>{children}</>;
}
