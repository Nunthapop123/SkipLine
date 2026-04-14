export function PickupTimeBanner({ time }: { time: string }) {
  return (
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
          {time}
        </p>
      </div>
    </section>
  );
}