"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import OrderCard from "../../../components/my-order/OrderCard";
import { getUserOrders, type OrderResponse } from "../../data/orderApi";

export default function MyOrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const normalizeOrders = (fetchedOrders: OrderResponse[] = []): OrderResponse[] => {
    // Keep only real transactions and guard against accidental duplicates from API responses.
    const visibleOrders = fetchedOrders.filter(
      (order) => (order.status || "").toUpperCase() !== "PENDING_PAYMENT"
    );

    const uniqueById = new Map<string, OrderResponse>();
    for (const order of visibleOrders) {
      uniqueById.set(order.id, order);
    }

    return Array.from(uniqueById.values());
  };

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("auth_token")
            : null;
        if (!token) {
          router.push("/login");
          return;
        }

        const fetchedOrders = await getUserOrders(token);
        const normalizedOrders = normalizeOrders(fetchedOrders || []);

        setOrders(normalizedOrders);
        if (normalizedOrders.length > 0) {
          setExpandedOrderId(normalizedOrders[0].id);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const { currentOrder, orderHistory } = useMemo(() => {
    const active = orders.filter((o) =>
      ["CONFIRMED", "PREPARING", "READY"].includes(o.status?.toUpperCase() || "")
    );
    const history = orders.filter(
      (o) => !["CONFIRMED", "PREPARING", "READY"].includes(o.status?.toUpperCase() || "")
    );
    return { currentOrder: active.length > 0 ? active[0] : null, orderHistory: history };
  }, [orders]);

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="w-full px-4 sm:px-6 pt-6 pb-6 sm:pt-8 sm:pb-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 pt-12">
              <h1 className="mb-6 text-4xl sm:text-5xl font-bold text-[#3D5690]">Your Order</h1>
              <p className="text-base sm:text-lg text-[#3D5690]">
                Track your current orders and view past purchases.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-lg text-gray-600">Loading orders...</p>
              </div>
            ) : (
              <>
                {currentOrder ? (
                  <section className="mb-16">
                    <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-[#3D5690]">Current Order</h2>
                    <div className="space-y-3">
                      <OrderCard
                        order={currentOrder}
                        isCurrentOrder={true}
                        isExpanded={expandedOrderId === currentOrder.id}
                        onToggle={() =>
                          setExpandedOrderId(
                            expandedOrderId === currentOrder.id ? null : currentOrder.id
                          )
                        }
                      />
                      {orders
                        .filter(
                          (o) =>
                            ["CONFIRMED", "PREPARING", "READY"].includes(
                              o.status?.toUpperCase() || ""
                            ) && o.id !== currentOrder.id
                        )
                        .map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            isCurrentOrder={true}
                            isExpanded={expandedOrderId === order.id}
                            onToggle={() =>
                              setExpandedOrderId(
                                expandedOrderId === order.id ? null : order.id
                              )
                            }
                          />
                        ))}
                    </div>
                  </section>
                ) : (
                  <section className="mb-16">
                    <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-[#3D5690]">Current Order</h2>
                    <div className="rounded-2xl border-[1.5px] border-[#3D5690] bg-[#EDEBDF] p-8 text-center">
                      <p className="text-base text-[#3D5690]/70 mb-5">No current orders</p>
                      <Link
                        href="/menu"
                        className="inline-block rounded-xl bg-[#3D5690] px-8 py-3 text-sm font-bold text-[#EDEBDF] hover:opacity-90 transition-opacity"
                      >
                        Start a New Order
                      </Link>
                    </div>
                  </section>
                )}

                {orderHistory.length > 0 && (
                  <section>
                    <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-[#3D5690]">History</h2>
                    <div className="space-y-3">
                      {orderHistory.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          isCurrentOrder={false}
                          isExpanded={expandedOrderId === order.id}
                          onToggle={() =>
                            setExpandedOrderId(
                              expandedOrderId === order.id ? null : order.id
                            )
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}

                {orders.length === 0 && (
                  <div className="rounded-2xl border-[1.5px] border-[#3D5690] bg-[#EDEBDF] p-10 text-center">
                    <p className="mb-3 text-xl font-semibold text-[#3D5690]">No orders yet</p>
                    <p className="mb-8 text-sm text-[#3D5690]/60">
                      Start by exploring our menu and placing your first order!
                    </p>
                    <Link
                      href="/menu"
                      className="inline-block rounded-xl bg-[#3D5690] px-8 py-3 text-sm font-bold text-[#EDEBDF] hover:opacity-90 transition-opacity"
                    >
                      View Menu
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
