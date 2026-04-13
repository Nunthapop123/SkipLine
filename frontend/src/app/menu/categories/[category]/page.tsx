import React from 'react';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';
import ProductCard from '../../../../../components/menu/ProductCard';
import CategoriesSidebar from '../../../../../components/menu/CategoriesSidebar';
import MenuBanner from '../../../../../components/menu/MenuBanner';
import MenuSearchBar from '../../../../../components/menu/MenuSearchBar';
import { categoriesData } from '../../../../data/menuData';

const CategoryPage = async ({ params }: { params: any }) => {
  const resolvedParams = await params;
  const categoryId = resolvedParams.category;
  const category = categoriesData[categoryId] || categoriesData['hot-coffee'];

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      <main className="container flex-1 mx-auto pt-24 px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <MenuBanner />
          <MenuSearchBar />
          
          <div className="flex flex-col md:flex-row gap-8">
            <CategoriesSidebar activeCategory={categoryId} />
            
            <section className="flex-1 flex flex-col gap-14">
              <div>
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#3D5690]">{category.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.products.map((product: any) => (
                    <ProductCard 
                      key={product.id} 
                      title={product.title} 
                      price={product.price} 
                      imageSrc={category.image} 
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
