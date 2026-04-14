import Link from 'next/link';
import React from 'react';

interface SidebarCategory {
  id: number;
  name: string;
  slug: string;
}

interface CategoriesSidebarProps {
  categories: SidebarCategory[];
  activeCategory?: string; // Will evaluate to undefined when viewing the overall menu page
}

const CategoriesSidebar = ({ categories, activeCategory }: CategoriesSidebarProps) => {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm sticky top-32 border border-[#3D5690]/5">
        <h3 className="text-lg font-bold text-[#3D5690] mb-4 pb-4 border-b-2 border-[#3D5690]">
          Categories
        </h3>
        <ul className="flex flex-col space-y-1">
          <li>
            <Link 
              href="/menu" 
              className={`block w-full px-4 py-2.5 rounded-xl ${!activeCategory ? 'bg-[#3D5690]/10 font-bold' : 'hover:bg-[#3D5690]/5 font-semibold'} text-[#3D5690] text-base transition-all`}
            >
              Menu Overview
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/menu/categories/${category.slug}`}
                className={`block w-full px-4 py-2.5 rounded-xl ${activeCategory === category.slug ? 'bg-[#3D5690]/10 font-bold' : 'hover:bg-[#3D5690]/5 font-semibold'} text-[#3D5690] text-base transition-all`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default CategoriesSidebar;
