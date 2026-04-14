type TransactionDetail = {
  label: string;
  value: string;
};

export function TransactionDetails({ details }: { details: TransactionDetail[] }) {
  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-2xl font-bold leading-none sm:text-[1.7rem]">Transaction Details</h2>
      <div className="mt-3 h-px bg-[#3D5690]/45" />

      <dl className="mt-5 space-y-4 text-[#3D5690] sm:mt-6">
        {details.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-6">
            <dt className="text-sm font-medium leading-tight text-[#3D5690]/75 sm:text-base">{item.label}</dt>
            <dd className="text-right text-sm font-bold leading-tight sm:text-base">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 h-px bg-[#3D5690]/45" />
    </section>
  );
}