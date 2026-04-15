'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // Not logged in, redirect to login
      router.push('/staff/login');
      return;
    }

    // Logged in - verify user is staff or admin
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'STAFF' && userData.role !== 'ADMIN') {
        // Not a staff/admin user, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/staff/login');
        return;
      }
      // Valid staff/admin user, redirect to dashboard
      router.push('/staff/dashborad');
    } catch (err) {
      // Invalid user data, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/staff/login');
    }
  }, [router]);

  return null;
}