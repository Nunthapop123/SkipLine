export type CartAddOn = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = {
  id?: number; // Only for backend items
  product_id: number;
  size: string;
  sweetness_level: number;
  add_ons?: CartAddOn[];
  addOns?: CartAddOn[];
  quantity: number;
  unit_price?: number; // Only for backend items
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

// Get cart from backend (for logged-in users)
export async function getBackendCart(token: string) {
  try {
    const response = await fetch(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Add item to backend cart (for logged-in users)
export async function addToBackendCart(item: CartItem, token: string) {
  try {
    const addOns = item.add_ons ?? item.addOns ?? [];
    const payload = {
      ...item,
      add_ons: addOns,
      addOns,
    };

    const response = await fetch(`${API_BASE}/cart/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  itemId: number,
  quantity: number,
  token: string
) {
  try {
    const response = await fetch(`${API_BASE}/cart/items/${itemId}?quantity=${quantity}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

//  Remove item from cart
export async function removeCartItem(itemId: number, token: string) {
  try {
    const response = await fetch(`${API_BASE}/cart/items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.ok;
  } catch {
    return false;
  }
}
