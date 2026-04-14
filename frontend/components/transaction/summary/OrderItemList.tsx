import Image from "next/image";

type OrderItem = {
  id: string;
  name: string;
  size: string;
  sweetness: string;
  addOns: string;
  quantity: string;
  price: string;
  image: string;
};

export function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-2xl font-bold leading-none sm:text-[1.7rem]">Your Order</h2>
      <div className="mt-4 rounded-2xl bg-[#D9D9D9] px-4 py-5 sm:px-6 sm:py-6">
        <div className="space-y-6 sm:space-y-7">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 sm:gap-5">
              <div className="relative h-20 w-16 shrink-0 sm:h-24 sm:w-20">
                <Image src={item.image} alt={item.name} fill className="object-contain" />
              </div>

              <div className="min-w-0 flex-1 pt-1 sm:pt-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold leading-none sm:text-xl">{item.name}</p>
                    <p className="mt-2 text-sm font-semibold leading-none text-[#3D5690]/85 sm:text-base">
                      {item.size} | {item.sweetness}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold leading-none text-[#3D5690]/85 sm:text-base">
                      {item.addOns}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold leading-none text-[#3D5690]/85 sm:text-base">
                      {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-extrabold leading-none sm:text-xl">{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}