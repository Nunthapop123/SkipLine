import React from 'react';
import { Search } from 'lucide-react';

const MenuSearchBar = () => {
  return (
    <div className="w-full flex justify-center mb-12">
      <div className="relative w-full max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={16} className="text-[#3D5690]/70" strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder="Search for a products" 
          className="w-full pl-11 pr-4 py-4 bg-[#D9D9D9] text-[#3D5690] text-base font-bold rounded-xl border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] outline-none transition-all shadow-sm placeholder-[#3D5690]/50"
        />
      </div>
    </div>
  );
};

export default MenuSearchBar;
