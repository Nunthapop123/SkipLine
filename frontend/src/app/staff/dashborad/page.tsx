'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const StaffDashBoardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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
      setAuthenticated(true);
    } catch (err) {
      // Invalid user data, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/staff/login');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F1E9]">
        <div className="text-center">
          <p className="text-[#465985] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F3F1E9] p-8">
      <h1 className="text-4xl font-bold text-[#465985]">Staff Dashboard</h1>
      <p className="text-[#7A8AAB] mt-2">Welcome to the SkipLine staff portal</p>
    </div>
  );
};

export default StaffDashBoardPage;