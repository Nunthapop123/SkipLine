const API_BASES = Array.from(
  new Set([
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "http://127.0.0.1:8000/api",
    "http://localhost:8000/api",
  ].filter(Boolean) as string[])
);

async function fetchWithFallback(path: string, init?: RequestInit) {
  let lastError: unknown = null;

  for (const baseUrl of API_BASES) {
    try {
      const response = await fetch(`${baseUrl}${path}`, init);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to reach the API server');
}

export const adminApi = {
  getProducts: async () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetchWithFallback('/admin/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  updateProduct: async (productId: number, data: any) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetchWithFallback(`/admin/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  createProduct: async (data: any) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetchWithFallback('/admin/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  deleteProduct: async (productId: number) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetchWithFallback(`/admin/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  getSettings: async () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetchWithFallback('/admin/settings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  updateSettings: async (data: any) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetchWithFallback('/admin/settings', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  },

  getAnalytics: async () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const response = await fetchWithFallback('/admin/analytics/daily', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  getCategories: async () => {
    const response = await fetchWithFallback('/menu/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },
  
  uploadImage: async (file: File) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetchWithFallback('/admin/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  }
};
