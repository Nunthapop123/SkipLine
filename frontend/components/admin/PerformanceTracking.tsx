'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/data/adminApi';

const PerformanceTracking = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminApi.getAnalytics();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 text-[#465985] font-bold">Loading Analytics...</div>;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-[#3D5690] tracking-tight">Performance Tracking</h1>
          <p className="text-[#465985]/60 font-bold mt-2">Real-time business insights and health metrics.</p>
        </div>
        <div className="bg-[#D9D9D9] px-6 py-3 rounded-2xl border-2 border-[#3D5690]/10 font-bold text-[#3D5690] text-sm shadow-sm">
          Period: <span className="opacity-60">{stats?.period || 'Today'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Total Sales */}
        <div className="bg-[#D9D9D9] p-10 rounded-[40px] border-2 border-[#3D5690]/10 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
             <div className="text-8xl">💰</div>
          </div>
          <span className="text-[10px] font-black text-[#3D5690]/40 uppercase tracking-[0.2em]">Total Sales Today</span>
          <span className="text-5xl font-black text-[#3D5690] tracking-tighter">
            ${parseFloat(stats?.total_sales || 0).toFixed(2)}
          </span>
          <div className="mt-4 flex items-center gap-2 text-[#34C759] font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-[#34C759]"></span> Live Updates
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#D9D9D9] p-10 rounded-[40px] border-2 border-[#3D5690]/10 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
             <div className="text-8xl">📦</div>
          </div>
          <span className="text-[10px] font-black text-[#3D5690]/40 uppercase tracking-[0.2em]">Orders Processed</span>
          <span className="text-5xl font-black text-[#3D5690] tracking-tighter">
            {stats?.total_orders || 0}
          </span>
          <div className="mt-4 flex items-center gap-2 text-[#465985]/60 font-bold text-xs uppercase tracking-widest">
            Successful Transactions
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#D9D9D9] p-10 rounded-[40px] border-2 border-[#3D5690]/10 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
             <div className="text-8xl">📈</div>
          </div>
          <span className="text-[10px] font-black text-[#3D5690]/40 uppercase tracking-[0.2em]">Avg. Order Value</span>
          <span className="text-5xl font-black text-[#3D5690] tracking-tighter">
            ${stats?.total_orders > 0 
              ? (parseFloat(stats.total_sales) / stats.total_orders).toFixed(2) 
              : '0.00'}
          </span>
          <div className="mt-4 flex items-center gap-2 text-[#465985]/60 font-bold text-xs uppercase tracking-widest">
            Per customer visit
          </div>
        </div>
      </div>

      {/* Placeholder for Chart */}
      <div className="bg-[#D9D9D9] rounded-[40px] border-2 border-[#3D5690]/10 p-10 shadow-sm min-h-[400px] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center scale-150">
          <div className="grid grid-cols-12 gap-1 w-full h-full p-20">
             {[...Array(48)].map((_, i) => (
                <div key={i} className="bg-[#3D5690] rounded-t-lg" style={{ height: `${Math.random() * 100}%` }}></div>
             ))}
          </div>
        </div>
        <div className="z-10 text-center">
          <h3 className="text-2xl font-bold text-[#3D5690]">Sales Velocity</h3>
          <p className="text-[#465985]/60 font-medium">Hourly performance visualization coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTracking;
