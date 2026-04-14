import Link from 'next/link';

export default function CartActions() {
  return (
    <div className="mt-14 flex justify-end gap-4">
      <Link
        href="/menu"
        className="border-2 border-[#3D5690] text-[#3D5690] font-bold text-lg px-10 py-3 rounded-lg hover:bg-[#3D5690]/10 transition-colors"
      >
        Continue Shopping
      </Link>
      <button className="bg-[#3D5690] text-[#EDEBDF] font-bold text-lg px-10 py-3 rounded-lg hover:bg-[#2F4477] transition-colors">
        Proceed to checkout
      </button>
    </div>
  );
}
