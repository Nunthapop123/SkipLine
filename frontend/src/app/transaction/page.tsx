"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import TransactionCartSummary from "../../../components/transaction/TransactionCartSummary";
import TransactionCheckoutFlowModal from "../../../components/transaction/TransactionCheckoutFlowModal";
import TransactionContactInfo from "../../../components/transaction/TransactionContactInfo";
import TransactionPaymentMethod from "../../../components/transaction/TransactionPaymentMethod";
import TransactionQueueStatus from "../../../components/transaction/TransactionQueueStatus";
import { getBackendCart } from "../../data/cartApi";
import {
  createOrderFromCart,
  getOrderEstimateFromCart,
  markOrderPaid,
  type BackendPaymentMethod,
} from "../../data/orderApi";
import { getCurrentUserProfile } from "../../data/userApi";
import type { PaymentMethod, TransactionItem } from "../../../components/transaction/types";

type CheckoutFlowStep = "scan" | "verifying" | "success" | "failed" | null;

const formatReadyAroundTime = (minutesFromNow: number) => {
  if (minutesFromNow <= 0) return "--:--";

  const readyAt = new Date();
  readyAt.setMinutes(readyAt.getMinutes() + minutesFromNow);

  return readyAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function TransactionPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [checkoutFlowStep, setCheckoutFlowStep] = useState<CheckoutFlowStep>(null);
  const [receiptFileName, setReceiptFileName] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ordersAhead, setOrdersAhead] = useState(0);
  const [prepTimePerCup, setPrepTimePerCup] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [readyAroundTime, setReadyAroundTime] = useState("--:--");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("Not available");

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("auth_token")
      : null;

  const toBackendPaymentMethod = (value: PaymentMethod): BackendPaymentMethod => {
    if (value === "promptpay") return "PROMPTPAY";
    if (value === "cash") return "CASH";
    return "CREDIT_CARD";
  };

  useEffect(() => {
    let isMounted = true;

    const loadLiveData = async (showLoading = false) => {
      if (showLoading) {
        setIsLoading(true);
      }
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("auth_token")
            : null;

        if (!token) {
          if (isMounted) {
            setCartItems([]);
          }
          return;
        }

        const backendCart = await getBackendCart(token);
        if (!backendCart?.items || !Array.isArray(backendCart.items)) {
          if (isMounted) {
            setCartItems([]);
            setOrdersAhead(0);
            setPrepTimePerCup(0);
            setEstimatedWait(0);
            setReadyAroundTime("--:--");
          }
          return;
        }

        const items: TransactionItem[] = backendCart.items.map((apiItem: any) => ({
          id: String(apiItem.id),
          name: apiItem.product?.name || "Unknown Product",
          image: apiItem.product?.image_url || "/smallCup.png",
          sizeLabel: apiItem.size || "Small",
          sweetness: Number(apiItem.sweetness_level ?? 100),
          quantity: Number(apiItem.quantity || 1),
          price: Number(apiItem.unit_price || 0),
        }));

        if (isMounted) {
          setCartItems(items);
        }

        const queueEstimate = await getOrderEstimateFromCart(token);
        if (queueEstimate) {
          if (isMounted) {
            setOrdersAhead(queueEstimate.orders_ahead);
            setPrepTimePerCup(queueEstimate.prep_time_per_cup_minutes);
            setEstimatedWait(queueEstimate.estimated_wait_minutes);
          }
        }

        const profile = await getCurrentUserProfile(token);
        if (profile && isMounted) {
          setContactName(profile.name || "");
          setContactEmail(profile.email || "");
          setContactPhone(profile.phone || "Not available");
        }
      } catch {
        if (isMounted) {
          setCartItems([]);
          setOrdersAhead(0);
          setPrepTimePerCup(0);
          setEstimatedWait(0);
          setReadyAroundTime("--:--");
        }
      } finally {
        if (isMounted && showLoading) {
          setIsLoading(false);
        }
      }
    };

    void loadLiveData(true);

    const refreshOnVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadLiveData(false);
      }
    };

    const refreshOnFocus = () => {
      void loadLiveData(false);
    };

    document.addEventListener("visibilitychange", refreshOnVisibility);
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", refreshOnVisibility);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, []);

  useEffect(() => {
    if (estimatedWait <= 0) {
      setReadyAroundTime("--:--");
      return;
    }

    const refreshReadyAroundTime = () => {
      setReadyAroundTime(formatReadyAroundTime(estimatedWait));
    };

    refreshReadyAroundTime();
    const intervalId = window.setInterval(refreshReadyAroundTime, 60_000);

    return () => window.clearInterval(intervalId);
  }, [estimatedWait]);

  useEffect(() => {
    if (checkoutFlowStep !== "success" || !orderId) return;

    const timeoutId = window.setTimeout(() => {
      setCheckoutFlowStep(null);
      router.push(`/transaction/summary?orderId=${encodeURIComponent(orderId)}`);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [checkoutFlowStep, orderId, router]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const startVerification = (shouldSucceed: boolean) => {
    setCheckoutFlowStep("verifying");

    window.setTimeout(() => {
      if (shouldSucceed) {
        setCheckoutFlowStep("success");
        return;
      }

      setCheckoutFlowStep("failed");
    }, 2200);
  };

  const handleCheckoutClick = () => {
    if (!cartItems.length || isLoading || isSubmitting) return;

    const run = async () => {
      const token = getToken();
      if (!token) return;

      setIsSubmitting(true);
      setOrderId("");

      const createdOrder = await createOrderFromCart(
        token,
        toBackendPaymentMethod(paymentMethod),
        contactName || undefined
      );
      if (!createdOrder) {
        setCheckoutFlowStep("failed");
        setIsSubmitting(false);
        return;
      }

      setOrderId(createdOrder.id);

      if (paymentMethod === "promptpay") {
        setCheckoutFlowStep("scan");
        setIsSubmitting(false);
        return;
      }

      setReceiptFileName("");
      setCheckoutFlowStep("verifying");
      const paidOrder = await markOrderPaid(token, createdOrder.id);
      startVerification(Boolean(paidOrder));
      setIsSubmitting(false);
    };

    void run();
  };

  const handlePickReceipt = (file: File | null) => {
    setReceiptFileName(file?.name ?? "");
  };

  const handleConfirmReceipt = () => {
    if (!receiptFileName || !orderId || isSubmitting) return;

    // Validate receipt filename locally
    const isValidReceipt = receiptFileName === "successful.jpg";
    
    const run = async () => {
      const token = getToken();
      if (!token) return;

      setIsSubmitting(true);
      setCheckoutFlowStep("verifying");
      
      // Only call backend if receipt is valid, otherwise fail locally
      if (isValidReceipt) {
        const paidOrder = await markOrderPaid(token, orderId, receiptFileName);
        startVerification(Boolean(paidOrder));
      } else {
        startVerification(false);
      }
      
      setIsSubmitting(false);
    };

    void run();
  };

  const handleRetry = () => {
    setCheckoutFlowStep("scan");
  };

  const handleCloseFlow = () => {
    setCheckoutFlowStep(null);
    setReceiptFileName("");
  };

  const handleContinue = () => {
    if (!orderId) return;
    setCheckoutFlowStep(null);
    router.push(`/transaction/summary?orderId=${encodeURIComponent(orderId)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 pb-20 pt-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.95fr] lg:gap-10">
            <section>
              <TransactionQueueStatus
                ordersAhead={ordersAhead}
                prepTimePerCup={prepTimePerCup}
                estimatedWait={estimatedWait}
                readyAroundTime={readyAroundTime}
              />

              <TransactionContactInfo
                name={contactName}
                email={contactEmail}
                phone={contactPhone}
                onNameChange={setContactName}
              />

              <TransactionPaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </section>

            <TransactionCartSummary
              cartItems={cartItems}
              isLoading={isLoading}
              subtotal={subtotal}
              onCheckout={handleCheckoutClick}
            />
          </div>
        </div>
      </main>

      <TransactionCheckoutFlowModal
        step={checkoutFlowStep}
        subtotal={subtotal}
        orderId={orderId}
        receiptFileName={receiptFileName}
        onPickReceipt={handlePickReceipt}
        onConfirmReceipt={handleConfirmReceipt}
        onRetry={handleRetry}
        onClose={handleCloseFlow}
        onContinue={handleContinue}
      />

      <Footer />
    </div>
  );
}