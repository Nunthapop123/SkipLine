import Image from 'next/image';
import type { CartItem } from './types';

interface CartItemCardProps {
  item: CartItem;
  updateQuantity: (itemId: string, delta: number) => void;
  toggleDetails: (itemId: string) => void;
  removeAddOn: (itemId: string, addOnId: string) => void;
  getItemUnitTotal: (item: CartItem) => number;
}

export default function CartItemCard({
  item,
  updateQuantity,
  toggleDetails,
  removeAddOn,
  getItemUnitTotal,
}: CartItemCardProps) {
  return (
    <div className="py-4">
      <div className="flex gap-5">
        <div className="relative h-52 w-52 md:h-56 md:w-56 rounded-xl bg-[#D9D9D9]/80 p-3 shrink-0">
          <Image src={item.image} alt={item.name} fill className="object-contain p-0 scale-115" />
        </div>

        <div className="flex-1 border-b-2 border-[#3D5690]/50 pb-5">
          <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:justify-between">
            <div className="flex flex-col h-full min-h-56">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3D5690] leading-none mb-4">{item.name}</h2>

              <div className="flex flex-col gap-3 mb-3">
                <p className="text-lg leading-none">
                  <span className="text-[#3D5690]/70 font-medium">Size: </span>
                  <span className="text-[#3D5690] font-semibold">{item.sizeLabel}</span>
                </p>
                <p className="text-lg leading-none">
                  <span className="text-[#3D5690]/70 font-medium">Sweetness: </span>
                  <span className="text-[#3D5690] font-semibold">{item.sweetness}%</span>
                </p>
              </div>

              <button
                onClick={() => toggleDetails(item.id)}
                className="text-[#3D5690]/80 font-bold text-lg text-left hover:opacity-70 w-fit transition-opacity"
              >
                Details {item.showDetails ? '^' : 'v'}
              </button>

              {item.showDetails && item.addOns.length > 0 && (
                <div className="mt-4 w-full md:w-lg space-y-2.5">
                  {item.addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className="flex items-center justify-between rounded-xl bg-[#D9D9D9]/80 px-4 py-2"
                    >
                      <span className="text-[#3D5690] font-semibold text-base">{addOn.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#3D5690] font-semibold text-base">+ ${addOn.price.toFixed(0)}</span>
                        <button
                          onClick={() => removeAddOn(item.id, addOn.id)}
                          className="text-[#3D5690]/60 hover:text-[#3D5690] text-lg font-bold transition-colors"
                        >
                          x
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {item.showDetails && item.addOns.length === 0 && (
                <div className="mt-4 w-full md:w-lg rounded-xl bg-[#D9D9D9]/70 px-4 py-3">
                  <span className="text-[#3D5690]/80 font-semibold text-base">No add-ons selected</span>
                </div>
              )}

              <div className="mt-auto pt-6 flex items-center gap-5">
                <span className="text-[#3D5690] font-bold text-base">Quantity</span>
                <div className="flex items-center bg-[#D9D9D9]/80 rounded-2xl px-1.5 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-[#3D5690] font-bold text-xl hover:bg-[#D9D9D9] rounded-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-[#3D5690] font-bold text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#3D5690] font-bold text-xl hover:bg-[#D9D9D9] rounded-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right mt-1 md:mt-0">
              <span className="text-[30px] font-bold text-[#3D5690] leading-none">
                ${(getItemUnitTotal(item) * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
