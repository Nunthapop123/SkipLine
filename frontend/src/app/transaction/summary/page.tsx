import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";

const transactionDetails = [
  { label: "Order Number", value: "#67676767" },
  { label: "Date & Time", value: "14/03/2026 1:20 AM" },
  { label: "Payment method", value: "QR / PromptPay" },
  { label: "Amount paid", value: "$67.00" },
];

const orderItems = [
  {
    id: "1",
    name: "Ice Coffee",
    size: "Size: Small (12 Oz)",
    sweetness: "Sweetness: 100%",
    addOns: "Add-ons: Extra shot, Caramel drizzle",
    quantity: "Qty: 1",
    price: "$19.99",
    image: "/iceCoffee.png",
  },
  {
    id: "2",
    name: "Ice Coffee",
    size: "Size: Small (12 Oz)",
    sweetness: "Sweetness: 100%",
    addOns: "Add-ons: Vanilla shot",
    quantity: "Qty: 1",
    price: "$19.99",
    image: "/iceCoffee.png",
  },
];

export default function TransactionSummaryPage() {
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
                  11:32 AM
                </p>
              </div>
            </section>

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
