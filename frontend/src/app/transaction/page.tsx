"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import TransactionCartSummary from "../../../components/transaction/TransactionCartSummary";
import TransactionContactInfo from "../../../components/transaction/TransactionContactInfo";
import TransactionPaymentMethod from "../../../components/transaction/TransactionPaymentMethod";
import TransactionQueueStatus from "../../../components/transaction/TransactionQueueStatus";
import { getBackendCart } from "../../data/cartApi";
import type { PaymentMethod, TransactionItem } from "../../../components/transaction/types";

export default function TransactionPage() {
  const [cartItems, setCartItems] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("auth_token")
            : null;

        if (!token) {
          setCartItems([]);
          return;
        }

        const backendCart = await getBackendCart(token);
        if (!backendCart?.items || !Array.isArray(backendCart.items)) {
          setCartItems([]);
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

        setCartItems(items);
      } catch {
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const ordersAhead = cartItems.length > 0 ? 4 : 0;
  const prepTimePerCup = cartItems.length > 0 ? 2 : 0;
  const estimatedWait = cartItems.length > 0 ? 8 : 0;

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
              />

              <TransactionContactInfo />

              <TransactionPaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </section>

            <TransactionCartSummary
              cartItems={cartItems}
              isLoading={isLoading}
              subtotal={subtotal}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}