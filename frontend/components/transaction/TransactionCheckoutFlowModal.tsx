"use client";

import { AlertTriangle, Loader2, Upload, X } from "lucide-react";

type CheckoutFlowStep = "scan" | "verifying" | "success" | "failed" | null;

type TransactionCheckoutFlowModalProps = {
  step: CheckoutFlowStep;
  subtotal: number;
  orderId: string;
  receiptFileName: string;
  onPickReceipt: (file: File | null) => void;
  onConfirmReceipt: () => void;
  onRetry: () => void;
  onClose: () => void;
  onContinue: () => void;
};

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

export default function TransactionCheckoutFlowModal({
  step,
  subtotal,
  orderId,
  receiptFileName,
  onPickReceipt,
  onConfirmReceipt,
  onRetry,
  onClose,
  onContinue,
}: TransactionCheckoutFlowModalProps) {
  if (!step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-8">
      {step === "scan" && (
        <div className="w-full max-w-xl rounded-2xl bg-[#EDEBDF] px-8 py-8 text-[#3D5690] shadow-2xl sm:px-10 sm:py-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-3xl font-bold leading-none">Scan to Pay</h3>
              <p className="mt-2 text-base font-semibold opacity-80">
                Use any banking application to scan the QR code below.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-2 text-[#3D5690]/80 hover:bg-[#D9D9D9]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto mt-7 h-56 w-56 rounded-md bg-[#CFCFCF]" />
          <p className="mt-4 text-center text-sm font-semibold opacity-80">Amount to pay</p>
          <p className="text-center text-4xl font-extrabold leading-none">{formatMoney(subtotal)}</p>

          <label className="mt-6 block cursor-pointer rounded-xl border-2 border-dashed border-[#3D5690]/40 bg-[#EDEBDF] px-5 py-8 text-center hover:bg-[#E6E3D8]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPickReceipt(e.target.files?.[0] ?? null)}
            />
            <Upload className="mx-auto h-7 w-7" />
            <p className="mt-2 text-lg font-bold">Upload payment receipt</p>
            <p className="mt-1 text-base font-semibold opacity-80">
              {receiptFileName || "JPG, PNG, or JPEG"}
            </p>
          </label>

          <button
            onClick={onConfirmReceipt}
            disabled={!receiptFileName}
            className="mt-6 h-12 w-full rounded-md bg-[#3D5690] text-lg font-bold text-[#EDEBDF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Confirm payment
          </button>
        </div>
      )}

      {step === "verifying" && (
        <div className="w-full max-w-xl rounded-2xl bg-[#EDEBDF] px-10 py-10 text-center text-[#3D5690] shadow-2xl sm:px-12 sm:py-11">
          <Loader2 className="mx-auto h-16 w-16 animate-spin" />
          <h3 className="mt-6 text-3xl font-bold leading-none">Verifying your payment...</h3>

          <div className="mx-auto mt-6 w-full rounded-xl bg-[#D9D9D9] px-4 py-3.5 text-left">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-base font-semibold md:text-lg">
                {receiptFileName || "Processing payment record..."}
              </p>
              <span className="h-4 w-4 shrink-0 rounded-full bg-[#3D5690] animate-pulse" />
            </div>
          </div>

          <p className="mt-4 text-base font-semibold opacity-80 md:text-lg">
            Hold on while we verify your uploaded receipt.
          </p>
        </div>
      )}

      {step === "success" && (
        <div className="flex min-h-120 w-full max-w-xl flex-col rounded-3xl bg-[#EDEBDF] px-10 py-10 text-center text-[#3D5690] shadow-2xl sm:px-12 sm:py-11">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D9D9D9] text-4xl">
            ✓
          </div>
          <h3 className="mt-7 text-4xl font-bold leading-none">Thank you!</h3>
          <p className="mt-4 text-lg font-semibold opacity-80 md:text-xl">
            Your payment was verified successfully.
          </p>
          <p className="mt-1 text-lg font-semibold opacity-80 md:text-xl">
            Your order is now being prepared.
          </p>

          <div className="mx-auto mt-7 w-full rounded-xl bg-[#D9D9D9] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-semibold uppercase tracking-wide opacity-70">Order ID</p>
              <p className="truncate text-lg font-bold leading-none md:text-xl">{orderId || "Generating..."}</p>
            </div>
          </div>

          <div className="mt-7 flex gap-3">
            <button
              onClick={onContinue}
              className="h-13 flex-1 rounded-md border-2 border-[#3D5690] bg-transparent py-3 text-lg font-bold md:text-xl"
            >
              View summary
            </button>
          </div>
        </div>
      )}

      {step === "failed" && (
        <div className="flex min-h-120 w-full max-w-xl flex-col rounded-3xl bg-[#EDEBDF] px-10 py-10 text-[#3D5690] shadow-2xl sm:px-12 sm:py-11">
          <h3 className="text-4xl font-bold leading-none">Payment failed</h3>

          <div className="mt-6 rounded-xl bg-[#D9D9D9] p-5 sm:p-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-7 w-7 shrink-0" />
              <div>
                <p className="text-lg font-bold md:text-xl">Receipt could not verified</p>
                <p className="mt-1 text-base font-semibold opacity-80 md:text-lg">
                  Please try again with a valid and clear receipt image.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-base font-bold opacity-70 md:text-lg">COMMON REASONS</p>
          <ul className="mt-1 list-inside list-disc text-base font-semibold opacity-80 md:text-lg">
            <li>Wrong amount</li>
            <li>Image is blurry or incomplete</li>
          </ul>

          <div className="mt-7 flex gap-3">
            <button
              onClick={onRetry}
              className="h-13 flex-1 rounded-xl bg-[#3D5690] text-lg font-bold text-[#EDEBDF]"
            >
              Try again
            </button>
            <button
              onClick={onClose}
              className="h-13 flex-1 rounded-xl border-2 border-[#3D5690] bg-transparent text-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}