"use client";

import type { PaymentMethod } from "./types";

type TransactionPaymentMethodProps = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
};

export default function TransactionPaymentMethod({
  paymentMethod,
  setPaymentMethod,
}: TransactionPaymentMethodProps) {
  const optionClasses = (isSelected: boolean) =>
    `flex cursor-pointer items-center justify-between rounded-2xl border-2 px-5 py-5 transition-all ${
      isSelected ? "border-[#3D5690] bg-[#D9D9D9]" : "border-transparent bg-[#D9D9D9]"
    }`;

  return (
    <section>
      <h2 className="mt-10 text-[#3D5690] text-2xl font-bold leading-none md:text-2xl">Payment method</h2>

      <div className="mt-5 space-y-4">
        <label className={optionClasses(paymentMethod === "card")}>
          <div className="flex items-center gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDEBDF] text-xl">💳</span>
            <div>
              <p className="text-[#3D5690] text-lg font-bold leading-none md:text-lg">Credit / Debit Card</p>
              <p className="mt-2 text-[#3D5690] text-sm font-semibold leading-none opacity-80 md:text-sm">
                Visa, Mastercard, JCB
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
            className="h-6 w-6 accent-[#3D5690]"
          />
        </label>

        <label className={optionClasses(paymentMethod === "promptpay")}>
          <div className="flex items-center gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDEBDF] text-xl">📱</span>
            <div>
              <p className="text-[#3D5690] text-lg font-bold leading-none md:text-lg">QR / PromptPay</p>
              <p className="mt-2 text-[#3D5690] text-sm font-semibold leading-none opacity-80 md:text-sm">
                Scan & Pay Instantly
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "promptpay"}
            onChange={() => setPaymentMethod("promptpay")}
            className="h-6 w-6 accent-[#3D5690]"
          />
        </label>

        <label className={optionClasses(paymentMethod === "cash")}>
          <div className="flex items-center gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDEBDF] text-xl">💵</span>
            <div>
              <p className="text-[#3D5690] text-lg font-bold leading-none md:text-lg">Cash at pickup</p>
              <p className="mt-2 text-[#3D5690] text-sm font-semibold leading-none opacity-80 md:text-sm">
                Pay when you collect
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
            className="h-6 w-6 accent-[#3D5690]"
          />
        </label>
      </div>
    </section>
  );
}
