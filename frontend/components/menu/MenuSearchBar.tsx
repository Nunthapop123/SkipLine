import React from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface MenuSearchBarProps {
  initialQuery?: string;
}

const MenuSearchBar = ({ initialQuery = '' }: MenuSearchBarProps) => {
  return (
    <div className="w-full flex justify-center mb-12">
      <form action="/menu" method="get" className="relative w-full max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Search size={16} className="text-[#3D5690]/70" strokeWidth={2.5} />
        </div>
        <input 
          name="q"
          type="text" 
          defaultValue={initialQuery}
          placeholder="Search menu (e.g. ma, latte, tea)"
          className="w-full pl-11 pr-28 py-4 bg-[#D9D9D9] text-[#3D5690] text-base font-bold rounded-xl border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] outline-none transition-all shadow-sm placeholder-[#3D5690]/50"
        />

        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          {initialQuery && (
            <Link
              href="/menu"
              className="px-2 py-1 rounded-md text-xs font-bold text-[#3D5690]/70 hover:bg-[#3D5690]/10"
            >
              Clear
            </Link>
          )}
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#3D5690] text-[#EDEBDF] hover:bg-[#2F4477] transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuSearchBar;
