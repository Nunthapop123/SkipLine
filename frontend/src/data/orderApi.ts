export type BackendPaymentMethod = "CREDIT_CARD" | "PROMPTPAY" | "CASH";

export type OrderItemAddon = {
  name: string;
  price: number;
};

export type OrderItemProduct = {
  id: number;
  name: string;
  image_url?: string | null;
};

export type OrderItemResponse = {
  id: number;
  product_id: number;
  size: string;
  sweetness_level: number;
  addons?: OrderItemAddon[] | null;
  quantity: number;
  item_subtotal: number;
  product?: OrderItemProduct | null;
};

export type OrderResponse = {
  id: string;
  order_number: string;
  guest_name?: string | null;
  total_amount: number;
  payment_method: BackendPaymentMethod;
  status: string;
  payment_slip_url?: string | null;
  created_at?: string | null;
  estimated_pickup_time?: string | null;
  items: OrderItemResponse[];
};

export type OrderQueueEstimateResponse = {
  orders_ahead: number;
  prep_time_per_cup_minutes: number;
  estimated_wait_minutes: number;
  total_prep_seconds: number;
  estimated_pickup_time?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export async function createOrderFromCart(
  token: string,
  paymentMethod: BackendPaymentMethod,
  guestName?: string
): Promise<OrderResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/from-cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_method: paymentMethod,
        guest_name: guestName || undefined,
      }),
    });

    if (!response.ok) return null;
    return (await response.json()) as OrderResponse;
  } catch {
    return null;
  }
}

export async function markOrderPaid(
  token: string,
  orderId: string,
  paymentSlipUrl?: string
): Promise<OrderResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/pay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_slip_url: paymentSlipUrl || undefined }),
    });

    if (!response.ok) return null;
    return (await response.json()) as OrderResponse;
  } catch {
    return null;
  }
}

export async function getOrderById(token: string, orderId: string): Promise<OrderResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as OrderResponse;
  } catch {
    return null;
  }
}

export async function getOrderEstimateFromCart(token: string): Promise<OrderQueueEstimateResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/estimate-from-cart`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as OrderQueueEstimateResponse;
  } catch {
    return null;
  }
}
