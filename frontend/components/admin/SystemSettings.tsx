'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/data/adminApi';

const SystemSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminApi.getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleBusyMode = async () => {
    if (!settings) return;
    setUpdating(true);
    try {
      const updated = await adminApi.updateSettings({ 
        is_busy_mode_active: !settings.is_busy_mode_active,
        base_prep_time_minutes: settings.base_prep_time_minutes
      });
      setSettings(updated);
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePrepTime = async (minutes: number) => {
    if (!settings) return;
    setUpdating(true);
    try {
      const updated = await adminApi.updateSettings({ 
        is_busy_mode_active: settings.is_busy_mode_active,
        base_prep_time_minutes: Math.max(1, minutes)
      });
      setSettings(updated);
    } catch (err) {
      alert('Failed to update prep time');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-[#465985] font-bold">Loading Settings...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-extrabold text-[#3D5690] tracking-tight">System Settings</h1>
        <p className="text-[#465985]/60 font-bold mt-2">Configure global store behavior and limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Busy Mode Card */}
        <div className={`p-10 rounded-[40px] border-4 transition-all ${
          settings?.is_busy_mode_active 
            ? 'bg-[#E55B5B]/10 border-[#E55B5B] shadow-[0_0_40px_rgba(229,91,91,0.1)]' 
            : 'bg-[#D9D9D9] border-[#3D5690]/10 shadow-sm'
        }`}>
          <div className="flex flex-col h-full justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${settings?.is_busy_mode_active ? 'bg-[#E55B5B]' : 'bg-[#34C759]'}`}></div>
                <h2 className="text-2xl font-bold text-[#3D5690]">Busy Mode</h2>
              </div>
              <p className="text-[#465985]/70 font-medium leading-relaxed">
                When active, customers will see a high-demand warning and Checkout may be temporarily disabled to prevent staff overload.
              </p>
            </div>

            <button 
              onClick={handleToggleBusyMode}
              disabled={updating}
              className={`w-full py-6 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] ${
                settings?.is_busy_mode_active 
                  ? 'bg-[#E55B5B] text-white shadow-[#E55B5B]/20' 
                  : 'bg-[#3D5690] text-white shadow-[#3D5690]/20'
              }`}
            >
              {settings?.is_busy_mode_active ? 'DISABLE BUSY MODE' : 'ENABLE BUSY MODE'}
            </button>
          </div>
        </div>

        {/* Prep Time Card */}
        <div className="bg-[#D9D9D9] p-10 rounded-[40px] border-4 border-[#3D5690]/10 shadow-sm">
          <div className="flex flex-col h-full justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#3D5690] mb-4">Base Prep Time</h2>
              <p className="text-[#465985]/70 font-medium leading-relaxed">
                The minimum time added to every new order estimation. Increase this during busy hours to manage expectations.
              </p>
            </div>

            <div className="flex items-center justify-between bg-[#F3F1E9] p-4 rounded-3xl border-2 border-[#3D5690]/5">
              <button 
                onClick={() => handleUpdatePrepTime(settings?.base_prep_time_minutes - 1)}
                className="w-14 h-14 bg-[#D9D9D9] text-[#3D5690] rounded-2xl font-black text-2xl shadow-sm hover:scale-105 transition-all"
              >
                -
              </button>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-[#3D5690]">{settings?.base_prep_time_minutes}</span>
                <span className="text-[10px] font-bold text-[#3D5690]/40 uppercase tracking-widest mt-1">Minutes</span>
              </div>
              <button 
                onClick={() => handleUpdatePrepTime(settings?.base_prep_time_minutes + 1)}
                className="w-14 h-14 bg-[#D9D9D9] text-[#3D5690] rounded-2xl font-black text-2xl shadow-sm hover:scale-105 transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-[#3D5690]/5 border-2 border-[#3D5690]/10 p-8 rounded-3xl flex gap-6 items-start">
        <div className="text-3xl">ℹ️</div>
        <div>
          <h4 className="text-[#3D5690] font-bold text-lg">About System Overrides</h4>
          <p className="text-[#465985]/60 font-medium text-sm mt-1">
            System overrides affect all customers in real-time. Use these controls responsibly to maintain service quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
