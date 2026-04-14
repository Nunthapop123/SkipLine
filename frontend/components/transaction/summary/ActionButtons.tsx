import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-6">
      <Link
        href="/menu"
        className="flex h-12 items-center justify-center rounded-md border-2 border-[#3D5690] bg-transparent text-sm font-bold text-[#3D5690] transition-colors hover:bg-[#3D5690]/5 sm:h-13 sm:text-base"
      >
        Back to menu
      </Link>
      <Link
        href="/transaction"
        className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#3D5690] text-sm font-bold text-[#EDEBDF] transition-opacity hover:opacity-90 sm:h-13 sm:text-base"
      >
        Track Order
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}