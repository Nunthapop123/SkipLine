"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffNavbar from '../../../components/StaffNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/staff/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'ADMIN') {
        router.push('/staff/dashboard');
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      router.push('/staff/login');
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F3F1E9]">
        <div className="text-[#3D5690] font-bold text-xl animate-pulse">Verifying Access...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F1E9] overflow-hidden">
      <StaffNavbar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-10 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
