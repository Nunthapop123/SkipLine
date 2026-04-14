import React from 'react';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';
import ProductCard from '../../../../../components/menu/ProductCard';
import CategoriesSidebar from '../../../../../components/menu/CategoriesSidebar';
import MenuBanner from '../../../../../components/menu/MenuBanner';
import MenuSearchBar from '../../../../../components/menu/MenuSearchBar';
import { formatPrice, getMenuCategories, getMenuProducts } from '../../../../data/menuApi';

const CategoryPage = async ({ params }: { params: any }) => {
  const resolvedParams = await params;
  const categoryId = resolvedParams.category;
  const [categories, products] = await Promise.all([
    getMenuCategories(),
    getMenuProducts(categoryId),
  ]);

  const activeCategory =
    categories.find((category) => category.slug === categoryId) || categories[0] || null;

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      <main className="container flex-1 mx-auto pt-24 px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <MenuBanner />
          <MenuSearchBar />
          
          <div className="flex flex-col md:flex-row gap-8">
            <CategoriesSidebar categories={categories} activeCategory={categoryId} />
            
            <section className="flex-1 flex flex-col gap-14">
              <div>
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#3D5690]">{activeCategory?.name || 'Menu'}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      title={product.name} 
                      price={formatPrice(product.base_price)} 
                      imageSrc={product.image_url || activeCategory?.image_url || '/hotCoffee.png'} 
                      description={product.description || undefined}
                    />
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
