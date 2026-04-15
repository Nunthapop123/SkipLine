"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

import type { OrderResponse } from "../../src/data/orderApi";
import { addToBackendCart, type CartAddOn } from "../../src/data/cartApi";
import ProgressStepper from "./ProgressStepper";
import StatusBadge from "./StatusBadge";
import {
  formatMoney,
  formatOrderDate,
  formatPaymentMethod,
  formatPickupTime,
} from "./formatters";

type OrderCardProps = {
  order: OrderResponse;
  isCurrentOrder?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
};

export default function OrderCard({
  order,
  isCurrentOrder = false,
  isExpanded,
  onToggle,
}: OrderCardProps) {
  const totalItems = (order.items || []).length;
  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + Number(item.item_subtotal || 0),
    0
  );
  const discount = subtotal - Number(order.total_amount || 0);

  const [expandedItemIds, setExpandedItemIds] = useState<Set<number>>(new Set());
  const toggleItem = (id: number) =>
    setExpandedItemIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const [isReordering, setIsReordering] = useState(false);
  const router = useRouter();

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("auth_token")
          : null;
      if (!token) {
        router.push("/login");
        return;
      }

      for (const item of order.items || []) {
        const addOnsForCart: CartAddOn[] = (item.addons || []).map((addon, idx) => ({
          id: idx,
          name: addon.name,
          price: addon.price,
        }));

        await addToBackendCart(
          {
            product_id: item.product_id,
            quantity: item.quantity,
            size: item.size,
            sweetness_level: item.sweetness_level,
            add_ons: addOnsForCart,
            unit_price: item.item_subtotal / item.quantity,
          },
          token
        );
      }

      window.dispatchEvent(new Event("cart-updated"));
      router.push("/cart");
    } catch (error) {
      console.error("Failed to reorder:", error);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-[#3D5690] bg-[#EDEBDF]">
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-4 px-6 py-6 sm:px-8 sm:py-7"
      >
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-[#D9D9D9] text-[#3D5690]">
          <span className="text-[10px] font-semibold leading-none">Date</span>
          <span className="mt-1 text-sm font-bold leading-none">{formatOrderDate(order.created_at)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-[#3D5690]">#{order.order_number}</p>
          <p className="mt-0.5 text-sm text-[#3D5690]/85">
            {totalItems} Item{totalItems !== 1 ? "s" : ""}{"  "}
            {formatPaymentMethod(order.payment_method)}
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1">
          <StatusBadge status={isCurrentOrder ? order.status : "COMPLETED"} />
          <p className="text-xl font-bold text-[#3D5690]">{formatMoney(Number(order.total_amount || 0))}</p>
        </div>

        <div className="shrink-0 text-[#3D5690]">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t-[1.5px] border-[#3D5690] bg-[#EDEBDF] px-6 py-8 sm:px-8 sm:py-10">
          {isCurrentOrder && <ProgressStepper status={order.status} />}

          {isCurrentOrder && (
            <div className="mb-8 flex items-center justify-between rounded-xl bg-[#D9D9D9] px-6 py-5">
              <p className="text-base font-semibold text-[#3D5690]">Estimated pick-up time</p>
              <p className="text-lg font-bold text-[#3D5690]">{formatPickupTime(order.estimated_pickup_time)}</p>
            </div>
          )}

          <p className="mb-6 text-lg font-bold text-[#3D5690]">Order Items</p>

          <div className="space-y-0">
            {(order.items || []).map((item, idx) => {
              const itemExpanded = expandedItemIds.has(item.id);
              const hasAddons = item.addons && item.addons.length > 0;

              return (
                <div key={item.id} className={`py-4 first:pt-0 last:pb-0 ${idx < (order.items || []).length - 1 ? "border-b-[1.5px] border-[#3D5690]" : ""}`}>
                  <div className="flex items-start gap-5">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#D9D9D9]">
                      {item.product?.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name || "Product"}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#3D5690]/40">
                          <Package size={28} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {!isCurrentOrder ? (
                        <>
                          <div className="flex flex-wrap items-baseline gap-2">
                            <p className="text-lg font-bold text-[#3D5690]">{item.product?.name || "Unknown"}</p>
                            <p className="text-sm text-[#3D5690]/85">Size: {item.size}</p>
                            <p className="text-sm text-[#3D5690]/85">Sweetness: {item.sweetness_level}%</p>
                            <p className="text-sm text-[#3D5690]/85">Qty: {item.quantity}</p>
                          </div>

                          <button
                            onClick={() => toggleItem(item.id)}
                            className="mt-2.5 flex items-center gap-1 text-sm font-semibold text-[#3D5690]/80 hover:text-[#3D5690]"
                          >
                            <span>Details</span>
                            {itemExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>

                          {itemExpanded && (
                            <div className="mt-2 space-y-1 rounded-lg bg-[#D9D9D9] px-4 py-2.5">
                              {hasAddons ? (
                                <>
                                  <div className="flex justify-between text-sm text-[#3D5690]/80">
                                    <span>Base Price</span>
                                    <span>
                                      {formatMoney(
                                        Number(item.item_subtotal || 0) -
                                          (item.addons || []).reduce(
                                            (s, a) => s + Number(a.price || 0) * item.quantity,
                                            0
                                          )
                                      )}
                                    </span>
                                  </div>
                                  {(item.addons || []).map((addon, i) => (
                                    <div key={i} className="flex justify-between text-sm text-[#3D5690]/80">
                                      <span>{addon.name}</span>
                                      <span>+ {formatMoney(addon.price)}</span>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <div className="text-sm font-semibold text-[#3D5690]/80">No add-ons selected</div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-bold text-[#3D5690]">{item.product?.name || "Unknown"}</p>
                          <p className="mt-0.5 text-sm text-[#3D5690]/85">
                            Size: {item.size} | Sweetness: {item.sweetness_level}%
                          </p>
                          <p className="mt-0.5 text-sm text-[#3D5690]/85">
                            Add-on: {(item.addons || []).length > 0 ? item.addons?.map((addon) => addon.name).join(", ") : "None"}
                          </p>
                          <p className="mt-0.5 text-sm text-[#3D5690]/85">Qty: {item.quantity}</p>
                        </>
                      )}
                    </div>

                    <p className="shrink-0 text-lg font-bold text-[#3D5690]">
                      {formatMoney(Number(item.item_subtotal || 0))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-2.5 border-t-[1.5px] border-[#3D5690] pt-6">
            {isCurrentOrder && (
              <>
                <div className="flex justify-between text-base text-[#3D5690]/85">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between pb-4 text-base text-[#3D5690]/85">
                  <span>Discount</span>
                  <span>{discount > 0 ? `-${formatMoney(discount)}` : formatMoney(0)}</span>
                </div>
              </>
            )}
            <div
              className={`flex justify-between text-xl font-bold text-[#3D5690] ${
                isCurrentOrder ? "border-t-[1.5px] border-[#3D5690] pt-5" : "pt-3"
              }`}
            >
              <span>Total</span>
              <span>{formatMoney(Number(order.total_amount || 0))}</span>
            </div>
          </div>

          {!isCurrentOrder && (
            <button
              onClick={handleReorder}
              disabled={isReordering}
              className="mt-7 w-full rounded-xl bg-[#3D5690] py-3.5 text-base font-bold text-[#EDEBDF] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isReordering ? "Adding to cart..." : "Reorder →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
