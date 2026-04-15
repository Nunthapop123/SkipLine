import Link from 'next/link';

type CartActionsProps = {
  canCheckout: boolean;
};

export default function CartActions({ canCheckout }: CartActionsProps) {
  return (
    <div className="mt-14 flex justify-end gap-4">
      <Link
        href="/menu"
        className="border-2 border-[#3D5690] text-[#3D5690] font-bold text-lg px-10 py-3 rounded-lg hover:bg-[#3D5690]/10 transition-colors"
      >
        Continue Shopping
      </Link>
      {canCheckout ? (
        <Link
          href="/transaction"
          className="bg-[#3D5690] text-[#EDEBDF] font-bold text-lg px-10 py-3 rounded-lg hover:bg-[#2F4477] transition-colors"
        >
          Proceed to checkout
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg bg-[#3D5690]/45 px-10 py-3 text-lg font-bold text-[#EDEBDF]/80">
          Proceed to checkout
        </span>
      )}
    </div>
  );
}
