"use client";

import Image from "next/image";

import type { TransactionItem } from "./types";

type TransactionCartSummaryProps = {
  cartItems: TransactionItem[];
  isLoading: boolean;
  subtotal: number;
  onCheckout: () => void;
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

export default function TransactionCartSummary({
  cartItems,
  isLoading,
  subtotal,
  onCheckout,
}: TransactionCartSummaryProps) {
  return (
    <aside>
      <h2 className="text-[#3D5690] text-2xl font-bold leading-none md:text-3xl">Your Cart</h2>

      <div className="mt-6 rounded-2xl bg-[#D9D9D9] p-8 text-[#3D5690]">
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-base font-semibold">Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-base font-semibold">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold leading-none md:text-xl">{item.name}</p>
                  <p className="mt-1 text-sm font-semibold leading-none opacity-85 md:text-base">Size: {item.sizeLabel}</p>
                  <p className="mt-1 text-sm font-semibold leading-none opacity-85 md:text-base">Sweetness: {item.sweetness}%</p>
                  <p className="mt-1 text-sm font-semibold leading-none opacity-85 md:text-base">Qty: {item.quantity}</p>
                </div>
                <p className="text-lg font-bold leading-none md:text-xl">{formatMoney(item.price * item.quantity)}</p>
              </div>
            ))
          )}
        </div>

        <div className="my-5 h-0.5 bg-[#3D5690]/60" />

        <p className="text-sm font-semibold leading-none opacity-80">Gift card/ Discount code</p>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="text"
            className="h-11 flex-1 rounded-xl border-0 bg-[#EDEBDF] px-3 text-[#3D5690] focus:outline-none"
          />
          <button className="h-11 rounded-xl border-2 border-[#3D5690] px-4 text-sm font-bold leading-none md:text-base">
            Apply
          </button>
        </div>

        <div className="my-5 h-0.5 bg-[#3D5690]/60" />

        <div className="space-y-2 text-base font-semibold md:text-lg">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between opacity-85">
            <span>Discount</span>
            <span>$0 (Not Apply)</span>
          </div>
        </div>

        <div className="my-5 h-0.5 bg-[#3D5690]/60" />

        <div className="flex items-center justify-between py-2 text-[1.75rem] font-bold leading-none md:text-[1.95rem]">
          <span>Total</span>
          <span>{formatMoney(subtotal)}</span>
        </div>

        <button
          onClick={onCheckout}
          disabled={isLoading || cartItems.length === 0}
          className="mt-5 h-13 w-full rounded-xl bg-[#3D5690] text-lg font-bold text-[#EDEBDF] transition-colors hover:bg-[#2F4477] disabled:cursor-not-allowed disabled:opacity-60 md:text-xl"
        >
          Checkout
        </button>
      </div>
    </aside>
  );
}
