interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-12 mb-8 w-full max-w-xs">
      <span className="text-[#3D5690] font-bold text-lg">Quantity</span>
      
      <div className="flex items-center bg-[#D9D9D9]/80 rounded-2xl px-2 py-1.5">
        <button 
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center text-[#3D5690] font-bold text-2xl hover:bg-[#D9D9D9] rounded-xl transition-colors"
        >
          -
        </button>
        <span className="w-10 text-center text-[#3D5690] font-bold text-base">
          {quantity}
        </span>
        <button 
          onClick={() => onQuantityChange(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center text-[#3D5690] font-bold text-2xl hover:bg-[#D9D9D9] rounded-xl transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
