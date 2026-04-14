interface CartHeaderProps {
  cartItemCount: number;
  cartTotal: number;
}

export default function CartHeader({ cartItemCount, cartTotal }: CartHeaderProps) {
  return (
    <div className="flex items-end justify-between border-b-2 border-[#3D5690]/50 pb-5">
      <div className="flex items-end gap-4">
        <h1 className="text-3xl font-bold text-[#3D5690] leading-none">Your Cart</h1>
        <span className="text-[#3D5690]/80 font-semibold text-lg">{cartItemCount} Items</span>
      </div>
      <div className="flex items-end gap-4">
        <span className="text-[#3D5690] font-bold text-xl leading-none">Total</span>
        <span className="text-[#3D5690] font-bold text-[36px] leading-none">
          ${cartTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
