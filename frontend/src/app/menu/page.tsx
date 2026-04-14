import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/menu/ProductCard';
import CategoriesSidebar from '../../../components/menu/CategoriesSidebar';
import MenuBanner from '../../../components/menu/MenuBanner';
import MenuSearchBar from '../../../components/menu/MenuSearchBar';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, getMenuCategories, getMenuProducts } from '../../data/menuApi';

const MenuPage = async () => {
  const [categories, products] = await Promise.all([getMenuCategories(), getMenuProducts()]);

  const productsByCategory = products.reduce<Record<string, typeof products>>((acc, product) => {
    const key = product.category.slug;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      <main className="container flex-1 mx-auto pt-24 px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <MenuBanner />
          <MenuSearchBar />

          <div className="flex flex-col md:flex-row gap-8">
            <CategoriesSidebar categories={categories} />

            <section className="flex-1 flex flex-col gap-14">
              {categories.map((category) => {
                const previewProducts = (productsByCategory[category.slug] || []).slice(0, 3);
                
                return (
                  <div key={category.id}>
                    <div className="flex justify-between items-end mb-6 px-2">
                      <h2 className="text-2xl font-bold text-[#3D5690]">{category.name}</h2>
                      <Link href={`/menu/categories/${category.slug}`} className="flex items-center gap-1.5 text-[#3D5690] text-base font-bold hover:opacity-70 transition-opacity">
                        See More <ArrowRight size={16} strokeWidth={2.5} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {previewProducts.map((product) => (
                        <ProductCard 
                          key={product.id} 
                          id={product.id}
                          title={product.name} 
                          price={formatPrice(product.base_price)} 
                          imageSrc={product.image_url || category.image_url} 
                          description={product.description || undefined}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;