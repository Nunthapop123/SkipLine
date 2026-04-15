'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/data/adminApi';

interface Product {
  id: number;
  name: string;
  is_available: boolean;
  stock_quantity: number;
  category: { name: string };
}

const InventoryControl = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleUpdateStock = async (id: number, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    setUpdatingId(id);
    const newQuantity = Math.max(0, product.stock_quantity + delta);
    try {
      await adminApi.updateProduct(id, { stock_quantity: newQuantity });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: newQuantity } : p));
    } catch (err) {
      alert('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const handeToggleAvailable = async (product: Product) => {
    setUpdatingId(product.id);
    try {
      await adminApi.updateProduct(product.id, { is_available: !product.is_available });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_available: !product.is_available } : p));
    } catch (err) {
      alert('Failed to toggle availability');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && products.length === 0) return <div className="p-10 text-[#465985] font-bold">Loading Inventory...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-extrabold text-[#3D5690] tracking-tight">Inventory Control</h1>
        <p className="text-[#465985]/60 font-bold mt-2">Monitor and adjust stock levels in real-time.</p>
      </div>

      <div className="bg-[#D9D9D9] rounded-[32px] border-2 border-[#3D5690]/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F3F1E9] border-b-2 border-[#3D5690]/10">
              <th className="px-8 py-6 text-[10px] font-black text-[#3D5690]/40 uppercase tracking-[0.2em]">Product Item</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#3D5690]/40 uppercase tracking-[0.2em] text-center">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#3D5690]/40 uppercase tracking-[0.2em] text-center">Current Stock</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#3D5690]/40 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3D5690]/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#F3F1E9]/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#3D5690]/40 uppercase tracking-wider">{product.category.name}</span>
                    <span className="text-lg font-bold text-[#3D5690]">{product.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <button 
                    onClick={() => handeToggleAvailable(product)}
                    disabled={updatingId === product.id}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      product.is_available 
                        ? 'bg-[#34C759]/10 text-[#34C759] border-2 border-[#34C759]/20' 
                        : 'bg-[#E55B5B]/10 text-[#E55B5B] border-2 border-[#E55B5B]/20'
                    }`}
                  >
                    {product.is_available ? 'IN STOCK' : 'OUT OF STOCK'}
                  </button>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`text-2xl font-black ${product.stock_quantity > 5 ? 'text-[#3D5690]' : 'text-[#E55B5B]'}`}>
                    {product.stock_quantity}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button 
                      onClick={() => handleUpdateStock(product.id, -1)}
                      disabled={updatingId === product.id}
                      className="w-10 h-10 bg-[#F3F1E9] text-[#E55B5B] rounded-xl font-black text-xl hover:bg-[#E55B5B] hover:text-white transition-all shadow-sm flex items-center justify-center"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => handleUpdateStock(product.id, 1)}
                      disabled={updatingId === product.id}
                      className="w-10 h-10 bg-[#F3F1E9] text-[#34C759] rounded-xl font-black text-xl hover:bg-[#34C759] hover:text-white transition-all shadow-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryControl;
