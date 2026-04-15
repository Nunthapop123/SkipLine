'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/data/adminApi';

interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number | string;
  image_url?: string;
  is_available: boolean;
  stock_quantity: number;
  category: { id: number; name: string };
}

const MenuManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await adminApi.deleteProduct(id);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      await adminApi.updateProduct(product.id, { is_available: !product.is_available });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    setIsUploading(true);
    let imageUrl = editingProduct?.image_url || '';

    try {
      if (selectedFile) {
        const uploadRes = await adminApi.uploadImage(selectedFile);
        imageUrl = uploadRes.image_url;
      }

      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        base_price: parseFloat(formData.get('base_price') as string),
        category_id: parseInt(formData.get('category_id') as string),
        stock_quantity: parseInt(formData.get('stock_quantity') as string),
        image_url: imageUrl,
        is_available: editingProduct?.is_available ?? true
      };

      if (editingProduct?.id) {
        await adminApi.updateProduct(editingProduct.id, data);
      } else {
        await adminApi.createProduct(data);
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  if (loading && products.length === 0) return <div className="p-10 text-[#465985] font-bold">Loading Menu...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-[#3D5690] tracking-tight">Menu Management</h1>
          <p className="text-[#465985]/60 font-bold mt-2">Manage your shop's offerings and pricing.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-[#3D5690] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Item
        </button>
      </div>

      {error && (
        <div className="bg-[#E55B5B]/10 border-2 border-[#E55B5B] text-[#E55B5B] p-6 rounded-2xl font-bold">
          Error: {error}
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-[#D9D9D9] border-2 border-[#3D5690]/10 rounded-3xl p-6 flex items-center justify-between hover:border-[#3D5690]/30 transition-all shadow-sm">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 bg-[#F3F1E9] rounded-2xl flex items-center justify-center overflow-hidden border border-[#3D5690]/5">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#3D5690]/20 text-3xl font-bold">{product.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#3D5690]/50 uppercase tracking-widest">{product.category.name}</span>
                <h3 className="text-2xl font-bold text-[#3D5690]">{product.name}</h3>
                <div className="flex items-center gap-4 text-sm font-bold text-[#465985]">
                  <span className="bg-[#F3F1E9] px-3 py-1 rounded-lg">${parseFloat(product.base_price.toString()).toFixed(2)}</span>
                  <span className={`${product.stock_quantity > 0 ? 'text-[#34C759]' : 'text-[#E55B5B]'}`}>
                    Stock: {product.stock_quantity}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleToggleAvailability(product)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  product.is_available 
                    ? 'bg-[#34C759]/10 text-[#34C759] border-2 border-[#34C759]/20' 
                    : 'bg-[#E55B5B]/10 text-[#E55B5B] border-2 border-[#E55B5B]/20'
                }`}
              >
                {product.is_available ? 'Available' : 'Unavailable'}
              </button>
              <button 
                onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                className="p-3 bg-[#F3F1E9] text-[#3D5690] rounded-xl hover:bg-[#3D5690] hover:text-white transition-all shadow-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(product.id)}
                className="p-3 bg-[#F3F1E9] text-[#E55B5B] rounded-xl hover:bg-[#E55B5B] hover:text-white transition-all shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#3D5690]/40 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <div className="bg-[#F3F1E9] w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative border-4 border-[#3D5690]">
            <h2 className="text-3xl font-bold text-[#3D5690] mb-8">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#465985] uppercase tracking-wider ml-1">Product Name</label>
                <input 
                  name="name" 
                  defaultValue={editingProduct?.name} 
                  required 
                  className="bg-[#D9D9D9] border-2 border-[#3D5690]/10 rounded-2xl px-6 py-4 outline-none focus:border-[#3D5690] transition-all font-bold text-[#465985]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#465985] uppercase tracking-wider ml-1">Description</label>
                <textarea 
                  name="description" 
                  defaultValue={editingProduct?.description} 
                  className="bg-[#D9D9D9] border-2 border-[#3D5690]/10 rounded-2xl px-6 py-4 outline-none focus:border-[#3D5690] transition-all font-bold text-[#465985] h-24 resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#465985] uppercase tracking-wider ml-1">Product Image</label>
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-[#D9D9D9] rounded-2xl flex items-center justify-center overflow-hidden border-2 border-[#3D5690]/10">
                    {previewUrl || editingProduct?.image_url ? (
                      <img src={previewUrl || editingProduct?.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#3D5690]/20 text-3xl font-bold">+</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="inline-block cursor-pointer bg-[#D9D9D9] border-2 border-[#3D5690]/10 rounded-xl px-6 py-3 font-bold text-[#3D5690] hover:border-[#3D5690] transition-all"
                    >
                      {selectedFile ? 'Change File' : 'Choose Image'}
                    </label>
                    {selectedFile && <p className="text-[10px] font-bold text-[#465985] mt-2 truncate max-w-[200px]">{selectedFile.name}</p>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#465985] uppercase tracking-wider ml-1">Price ($)</label>
                  <input 
                    name="base_price" 
                    type="number" 
                    step="0.01" 
                    defaultValue={editingProduct?.base_price} 
                    required 
                    className="bg-[#D9D9D9] border-2 border-[#3D5690]/10 rounded-2xl px-6 py-4 outline-none focus:border-[#3D5690] transition-all font-bold text-[#465985]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#465985] uppercase tracking-wider ml-1">Stock</label>
                  <input 
                    name="stock_quantity" 
                    type="number" 
                    defaultValue={editingProduct?.stock_quantity} 
                    required 
                    className="bg-[#D9D9D9] border-2 border-[#3D5690]/10 rounded-2xl px-6 py-4 outline-none focus:border-[#3D5690] transition-all font-bold text-[#465985]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#465985] uppercase tracking-wider ml-1">Category</label>
                <select 
                  name="category_id" 
                  defaultValue={editingProduct?.category?.id} 
                  required
                  className="bg-[#D9D9D9] border-2 border-[#3D5690]/10 rounded-2xl px-6 py-4 outline-none focus:border-[#3D5690] transition-all font-bold text-[#465985] appearance-none"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-bold text-[#465985] bg-[#D9D9D9] rounded-2xl border-2 border-[#3D5690]/10 hover:bg-[#F3F1E9]/80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-2 bg-[#3D5690] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
