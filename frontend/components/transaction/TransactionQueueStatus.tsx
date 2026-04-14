"use client";

type TransactionQueueStatusProps = {
  ordersAhead: number;
  prepTimePerCup: number;
  estimatedWait: number;
};

export default function TransactionQueueStatus({
  ordersAhead,
  prepTimePerCup,
  estimatedWait,
}: TransactionQueueStatusProps) {
  return (
    <section>
      <h1 className="text-[#3D5690] text-2xl font-extrabold leading-none md:text-3xl">Checkout</h1>
      <div className="mt-5 h-0.75 w-full bg-[#3D5690]/60" />

      <h2 className="mt-8 text-[#3D5690] text-xl font-bold leading-none md:text-2xl">Queue Status</h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#D9D9D9] px-6 py-6 text-center text-[#3D5690] md:py-5">
          <p className="text-sm font-semibold opacity-80 md:text-base">Orders ahead</p>
          <p className="mt-3 text-3xl font-extrabold leading-none md:mt-4 md:text-3xl">{ordersAhead}</p>
        </div>
        <div className="rounded-2xl bg-[#D9D9D9] px-6 py-6 text-center text-[#3D5690] md:py-5">
          <p className="text-sm font-semibold opacity-80 md:text-base">Prep time/ cup</p>
          <p className="mt-3 text-3xl font-extrabold leading-none md:mt-4 md:text-3xl">
            {prepTimePerCup} <span className="text-sm md:text-base">mins</span>
          </p>
        </div>
        <div className="rounded-2xl bg-[#D9D9D9] px-6 py-6 text-center text-[#3D5690] md:py-5">
          <p className="text-sm font-semibold opacity-80 md:text-base">Estimated wait</p>
          <p className="mt-3 text-3xl font-extrabold leading-none md:mt-4 md:text-3xl">
            ~{estimatedWait} <span className="text-sm md:text-base">mins</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col justify-between gap-5 rounded-2xl bg-[#D9D9D9] px-7 py-6 text-[#3D5690] sm:flex-row sm:items-center">
        <div>
          <p className="text-xl font-bold leading-none md:text-2xl">Ready around</p>
          <p className="mt-2 max-w-85 text-sm font-semibold leading-5 opacity-80 md:text-base">
            Estimated time may vary by up to 5 minutes based on order volume.
          </p>
        </div>
        <p className="shrink-0 whitespace-nowrap text-4xl font-extrabold leading-none md:text-4xl">
          11:32 AM
        </p>
      </div>
    </section>
  );
}
