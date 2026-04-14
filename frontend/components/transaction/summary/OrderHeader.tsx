import { CheckCircle2 } from "lucide-react";

export function OrderHeader() {
  return (
    <section className="pb-7 pt-6 text-center sm:pt-8">
      <CheckCircle2 className="mx-auto h-20 w-20 text-[#3D5690] sm:h-24 sm:w-24" strokeWidth={2.2} />
      <h1 className="mt-4 text-3xl font-bold leading-none sm:text-4xl">Order confirmed!</h1>
      <p className="mt-4 text-base font-medium leading-relaxed text-[#3D5690]/55 sm:text-lg">
        Payment received - your drinks are being prepared now.
      </p>
    </section>
  );
}