export type MenuCategory = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
};

export type MenuProduct = {
  id: number;
  name: string;
  description: string | null;
  base_price: string;
  image_url: string | null;
  is_available: boolean;
  stock_quantity: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  sizes: Array<{
    id: number;
    size_name: string;
    price_adjustment: string;
  }>;
  add_ons: Array<{
    id: number;
    name: string;
    category: string;
    price_adjustment: string;
  }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api';

export async function getMenuCategories(): Promise<MenuCategory[]> {
  try {
    const response = await fetch(`${API_BASE}/menu/categories`, { cache: 'no-store' });
    if (!response.ok) return [];
    return (await response.json()) as MenuCategory[];
  } catch {
    return [];
  }
}

export async function getMenuProducts(categorySlug?: string): Promise<MenuProduct[]> {
  try {
    const url = new URL(`${API_BASE}/menu/products`);
    if (categorySlug) {
      url.searchParams.set('category', categorySlug);
    }

    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) return [];
    return (await response.json()) as MenuProduct[];
  } catch {
    return [];
  }
}

export async function getMenuProductById(productId: number): Promise<MenuProduct | null> {
  try {
    const response = await fetch(`${API_BASE}/menu/products/${productId}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as MenuProduct;
  } catch {
    return null;
  }
}

export function formatPrice(price: string): string {
  const parsed = Number(price);
  if (Number.isNaN(parsed)) return price;
  return parsed.toFixed(2);
}
