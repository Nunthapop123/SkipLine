"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { getOrderById, type OrderResponse } from "../../../data/orderApi";

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

const formatPaymentMethod = (value: string) => {
  if (value === "PROMPTPAY") return "QR / PromptPay";
  if (value === "CREDIT_CARD") return "Credit Card";
  if (value === "CASH") return "Cash";
  return value;
};

const formatDateTime = (isoDate?: string | null) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const formatPickupTime = (isoDate?: string | null) => {
  if (!isoDate) return "--:--";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function TransactionSummaryPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setOrder(null);
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      if (!token) {
        setOrder(null);
        setIsLoading(false);
        return;
      }

      const data = await getOrderById(token, orderId);
      setOrder(data);
      setIsLoading(false);
    };

    void loadOrder();
  }, [orderId]);

  const transactionDetails = useMemo(
    () => [
      { label: "Order Number", value: order?.order_number ?? "-" },
      { label: "Date & Time", value: formatDateTime(order?.estimated_pickup_time) },
      { label: "Payment method", value: order ? formatPaymentMethod(order.payment_method) : "-" },
      { label: "Amount paid", value: order ? formatMoney(Number(order.total_amount || 0)) : "$0.00" },
    ],
    [order]
  );

  const orderItems = useMemo(
    () =>
      (order?.items || []).map((item) => ({
        id: String(item.id),
        name: item.product?.name || "Coffee",
        size: `Size: ${item.size}`,
        sweetness: `Sweetness: ${item.sweetness_level}%`,
        addOns:
          item.addons && item.addons.length > 0
            ? `Add-ons: ${item.addons.map((addon) => addon.name).join(", ")}`
            : "Add-ons: None",
        quantity: `Qty: ${item.quantity}`,
        price: formatMoney(Number(item.item_subtotal || 0)),
        image: item.product?.image_url || "/iceCoffee.png",
      })),
    [order]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 pb-20 pt-0 sm:pt-2">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto w-full max-w-240 bg-[#EDEBDF] px-4 py-6 text-[#3D5690] sm:px-7 sm:py-8">
            <section className="pb-7 pt-4 text-center sm:pt-6">
              <CheckCircle2 className="mx-auto h-20 w-20 text-[#3D5690] sm:h-24 sm:w-24" strokeWidth={2.2} />
              <h1 className="mt-4 text-3xl font-bold leading-none sm:text-4xl">Order confirmed!</h1>
              <p className="mt-4 text-base font-medium leading-relaxed text-[#3D5690]/55 sm:text-lg">
                Payment received - your drinks are being prepared now.
              </p>
            </section>

            <section className="rounded-2xl bg-[#D9D9D9] px-5 py-5 text-[#3D5690] sm:px-8 sm:py-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <div className="flex-1">
                  <p className="text-lg font-bold leading-tight sm:whitespace-nowrap sm:text-2xl">
                    Your Order will be ready to pick-up around
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#3D5690]/65 sm:text-base">
                    Estimated time may vary by +/- 5 minutes depending on order volume.
                  </p>
                </div>
                <p className="shrink-0 whitespace-nowrap text-2xl font-extrabold leading-none sm:text-3xl">
                  {formatPickupTime(order?.estimated_pickup_time)}
                </p>
              </div>
            </section>

            {isLoading && (
              <div className="mt-6 rounded-xl bg-[#D9D9D9] px-4 py-3 text-sm font-semibold text-[#3D5690]">
                Loading order details...
              </div>
            )}

            {!isLoading && !order && (
              <div className="mt-6 rounded-xl bg-[#D9D9D9] px-4 py-3 text-sm font-semibold text-[#3D5690]">
                Order not found. Please return to transaction page and complete checkout.
              </div>
            )}

            <section className="mt-8 sm:mt-10">
              <h2 className="text-2xl font-bold leading-none sm:text-[1.7rem]">Transaction Details</h2>
              <div className="mt-3 h-px bg-[#3D5690]/45" />

              <dl className="mt-5 space-y-4 text-[#3D5690] sm:mt-6">
                {transactionDetails.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-6">
                    <dt className="text-sm font-medium leading-tight text-[#3D5690]/75 sm:text-base">{item.label}</dt>
                    <dd className="text-right text-sm font-bold leading-tight sm:text-base">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 h-px bg-[#3D5690]/45" />
            </section>

            <section className="mt-8 sm:mt-10">
              <h2 className="text-2xl font-bold leading-none sm:text-[1.7rem]">Your Order</h2>
              <div className="mt-4 rounded-2xl bg-[#D9D9D9] px-4 py-5 sm:px-6 sm:py-6">
                <div className="space-y-6 sm:space-y-7">
                  {!isLoading && orderItems.length === 0 && (
                    <p className="text-sm font-semibold text-[#3D5690]/75 sm:text-base">No items found for this order.</p>
                  )}
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 sm:gap-5">
                      <div className="relative h-20 w-16 shrink-0 sm:h-24 sm:w-20">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>

                      <div className="min-w-0 flex-1 pt-1 sm:pt-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-bold leading-none sm:text-xl">{item.name}</p>
                            <p className="mt-2 text-sm font-semibold leading-none text-[#3D5690]/85 sm:text-base">{item.size} | {item.sweetness}</p>
                            <p className="mt-1.5 text-sm font-semibold leading-none text-[#3D5690]/85 sm:text-base">{item.addOns}</p>
                            <p className="mt-1.5 text-sm font-semibold leading-none text-[#3D5690]/85 sm:text-base">{item.quantity}</p>
                          </div>

                          <p className="shrink-0 text-lg font-extrabold leading-none sm:text-xl">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-6">
              <Link
                href="/menu"
                className="flex h-12 items-center justify-center rounded-md border-2 border-[#3D5690] bg-transparent text-sm font-bold text-[#3D5690] transition-colors hover:bg-[#3D5690]/5 sm:h-13 sm:text-base"
              >
                Back to menu
              </Link>
              <Link
                href="/transaction"
                className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#3D5690] text-sm font-bold text-[#EDEBDF] transition-opacity hover:opacity-90 sm:h-13 sm:text-base"
              >
                Track Order
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
