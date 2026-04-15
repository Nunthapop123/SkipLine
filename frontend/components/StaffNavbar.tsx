"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const StaffNavbar = () => {
  const [userName, setUserName] = useState('Staff');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userName');
    router.push('/staff/login');
  };

  const navItems = [
    { name: 'Order Board', path: '/staff/dashboard' },
  ];

  return (
    <aside className="h-screen w-[400px] bg-[#EAE8DF] border-r border-[#3D5690]/10 flex flex-col p-10 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0">
      {/* Logo Area */}
      <div className="flex items-center justify-between mb-12">
        <div 
          className="cursor-pointer"
          onClick={() => router.push('/staff/dashboard')}
        >
          <span className="text-3xl font-bold text-[#3D5690] tracking-tight">
            SkipLine
          </span>
          <div className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-1 ml-0.5">
            Staff Portal
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => item.path !== '#' && router.push(item.path)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all text-left ${
              pathname === item.path 
                ? 'bg-[#3D5690] text-white shadow-md' 
                : 'text-[#465985]/60 hover:bg-[#F3F1E9] hover:text-[#3D5690]'
            }`}
          >
            <span className="text-[18px]">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer / User Area */}
      <div className="pt-8 border-t border-[#3D5690]/10 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-[#3D5690] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-[#465985] font-bold text-sm leading-tight">{userName}</span>
            <span className="text-[10px] font-bold text-[#465985]/40 uppercase tracking-wider mt-0.5">Authorized Staff</span>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl border border-[#E55B5B]/20 text-[#E55B5B] font-bold text-sm hover:bg-[#E55B5B]/5 transition-all flex items-center justify-center gap-2"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default StaffNavbar;
