'use client';

import React, { useEffect, useState, useCallback } from 'react';
import StaffNavbar from '../../../../components/StaffNavbar';
import { getActiveOrders, updateOrderStatus, type OrderResponse } from '../../../data/orderApi';

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const data = await getActiveOrders(token);
      if (data) {
        setOrders(data);
        setError(null);
      } else {
        setError('Failed to fetch orders from server.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('An unexpected error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) return;

    try {
      const updated = await updateOrderStatus(token, orderId, newStatus);
      if (updated) {
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const doingOrders = orders.filter(o => o.status === 'PREPARING');
  const doneOrders = orders.filter(o => o.status === 'READY');

  return (
    <div className="flex h-screen bg-[#F3F1E9] overflow-hidden">
      <StaffNavbar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-10 pt-10 pb-20">
          
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => { setLoading(true); fetchOrders(); }} className="underline hover:no-underline">Retry</button>
            </div>
          )}

          {loading && orders.length === 0 ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-[#3D5690] font-bold text-xl animate-pulse">Loading orders...</div>
            </div>
          ) : (
            <>
              {orders.length === 0 && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-[#465985]/60 bg-[#EAE8DF]/30 rounded-[28px] border-2 border-dashed border-[#465985]/20">
                  <div className="text-4xl mb-4">☕️</div>
                  <div className="font-bold text-lg">No active orders found</div>
                  <p className="text-sm">New orders will appear here automatically</p>
                </div>
              )}
              
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-start ${orders.length === 0 ? 'hidden' : ''}`}>
                {/* Confirmed Column */}
                <Column 
                  title="Confirmed" 
                  count={confirmedOrders.length} 
                  dotColor="bg-[#4C6291]"
                >
                  {confirmedOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      action="start" 
                      onAction={() => handleStatusUpdate(order.id, 'PREPARING')} 
                    />
                  ))}
                </Column>

                {/* Doing Column */}
                <Column 
                  title="Doing" 
                  count={doingOrders.length} 
                  dotColor="bg-[#FFCC00]"
                >
                  {doingOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      action="done" 
                      onAction={() => handleStatusUpdate(order.id, 'READY')} 
                    />
                  ))}
                </Column>

                {/* Done Column */}
                <Column 
                  title="Ready for Pickup" 
                  count={doneOrders.length} 
                  dotColor="bg-[#34C759]"
                >
                  {doneOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      action="pickup"
                      onAction={() => handleStatusUpdate(order.id, 'COMPLETED')}
                    />
                  ))}
                </Column>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* --- Reusable Components --- */

function Column({ title, count, dotColor, children }: { title: string, count: number, dotColor: string, children: React.ReactNode }) {
  return (
    <div className="bg-[#EAE8DF]/50 rounded-[28px] p-6 flex flex-col gap-6 min-h-[600px] shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full ${dotColor} shadow-md`}></span>
          <h2 className="text-[#465985] font-bold text-[22px] tracking-tight">{title}</h2>
        </div>
        <span className="bg-[#D9D7CE] text-[#465985] text-base font-bold px-3 py-1 rounded-full">
          {count}
        </span>
      </div>
      {/* Column Cards */}
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}

function OrderCard({ order, action, onAction }: { order: OrderResponse, action: 'start' | 'done' | 'pickup' | 'none', onAction?: () => void }) {
  const formatAmount = (amount: number | string) => {
    const parsed = typeof amount === 'number' ? amount : Number(amount);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
  };

  const getElapsedMinutes = (createdAt?: string | null) => {
    if (!createdAt) return null;
    const placedAt = new Date(createdAt).getTime();
    if (Number.isNaN(placedAt)) return null;
    return Math.max(0, Math.floor((Date.now() - placedAt) / 60000));
  };

  const getElapsedMinutesLabel = (createdAt?: string | null) => {
    const elapsedMinutes = getElapsedMinutes(createdAt);
    if (elapsedMinutes === null) return 'Just now';
    if (elapsedMinutes <= 0) return 'Just now';
    if (elapsedMinutes === 1) return '1 min ago';
    return `${elapsedMinutes} mins ago`;
  };

  const getFinishedTimeLabel = (finishedAt?: string | null, fallbackCreatedAt?: string | null) => {
    const source = finishedAt || fallbackCreatedAt;
    if (!source) return 'Finished';
    const parsed = new Date(source);
    if (Number.isNaN(parsed.getTime())) return 'Finished';
    return `Done ${parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  };

  const isDoneColumn = action === 'none' || action === 'pickup';
  const elapsedMinutes = getElapsedMinutes(order.created_at);
  const headerTimeLabel = isDoneColumn
    ? getFinishedTimeLabel(order.estimated_pickup_time, order.created_at)
    : getElapsedMinutesLabel(order.created_at);

  const getTimeBadgeClass = () => {
    if (isDoneColumn) {
      return 'bg-[#D9D7CE] text-[#465985] px-3 py-1.5 rounded-md';
    }

    if (elapsedMinutes === null || elapsedMinutes <= 2) {
      return 'bg-[#34C759] text-white px-3 py-1.5 rounded-md';
    }

    if (elapsedMinutes <= 5) {
      return 'bg-[#FFCC00] text-[#465985] px-3 py-1.5 rounded-md';
    }

    return 'bg-[#E55B5B] text-white px-3 py-1.5 rounded-md';
  };

  return (
    <div className="bg-[#F3F1E9] border-2 border-[#3D5690] rounded-[24px] p-6 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow duration-300">
      
      {/* Card Header */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-[#465985] font-bold text-[13px] tracking-[0.06em] uppercase opacity-70">
          {order.order_number.split('-').slice(0, 2).join('-')}
        </span>
        <span className={`${getTimeBadgeClass()} text-[12px] font-bold shadow-sm`}>
          {headerTimeLabel}
        </span>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="bg-[#D9D9D9] rounded-xl p-5 border border-transparent">
            <div className="flex justify-between items-start mb-4">
              <span className="font-bold text-[#465985] text-[17px] tracking-tight leading-tight max-w-[80%]">{item.product?.name || 'Drink'}</span>
              <span className="bg-[#4C6291] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase shrink-0 mt-0.5">x{item.quantity}</span>
            </div>
            
            <div className="flex flex-col gap-2.5 border-b border-[#465985]/10 pb-4 mb-4">
              <div className="flex justify-between items-center text-[14px] font-bold">
                <span className="text-[#7A8AAB] opacity-90">Sugar</span>
                <span className="text-[#465985]">{item.sweetness_level}%</span>
              </div>
              <div className="flex justify-between items-center text-[14px] font-bold">
                <span className="text-[#7A8AAB] opacity-90">Size</span>
                <span className="text-[#465985]">{item.size}</span>
              </div>
            </div>
            
            {item.addons && item.addons.length > 0 && (
              <div className="text-[13px] text-[#7A8AAB] font-bold px-1">
                <span className="opacity-60 uppercase text-[10px] tracking-wider block mb-1.5">Add-on</span>
                <div className="text-[#465985] leading-relaxed font-bold text-[14px]">
                  {item.addons.map(a => a.name).join(', ')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Card Footer */}
      <div className="flex justify-between items-end mt-1 px-1">
        <div>
          <div className="font-bold text-[#465985] text-[24px] leading-none mb-2 tracking-tighter">${formatAmount(order.total_amount)}</div>
          <div className="text-[12px] text-[#7A8AAB] font-bold tracking-tight opacity-90">{order.payment_method}</div>
        </div>
        
        {/* Render Button based on Action */}
        {action === 'start' && (
          <button 
            onClick={onAction}
            className="bg-[#4C6291] text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-[#34456a] transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 group"
          >
            Start
          </button>
        )}
        {action === 'done' && (
          <button 
            onClick={onAction}
            className="bg-[#4C6291] text-white text-sm font-bold py-2.5 px-8 rounded-xl hover:bg-[#34456a] transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Done
          </button>
        )}
        {action === 'pickup' && (
          <button
            onClick={onAction}
            className="bg-[#34C759] text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-[#26a34a] transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Picked Up
          </button>
        )}
      </div>

    </div>
  );
}

