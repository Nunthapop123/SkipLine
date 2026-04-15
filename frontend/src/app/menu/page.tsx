import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/menu/ProductCard';
import CategoriesSidebar from '../../../components/menu/CategoriesSidebar';
import MenuBanner from '../../../components/menu/MenuBanner';
import MenuSearchBar from '../../../components/menu/MenuSearchBar';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, getMenuCategories, getMenuProducts } from '../../data/menuApi';

const MenuPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }> | { q?: string };
}) => {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q ?? '').trim();
  const normalizedQuery = query.toLowerCase();

  const [categories, products] = await Promise.all([getMenuCategories(), getMenuProducts()]);

  const filteredProducts = normalizedQuery
    ? products.filter((product) => {
        const searchable = [
          product.name,
          product.description ?? '',
          product.category.name,
        ]
          .join(' ')
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
    : products;

  const productsByCategory = filteredProducts.reduce<Record<string, typeof products>>((acc, product) => {
    const key = product.category.slug;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {});

  const visibleCategories = categories.filter((category) => {
    return (productsByCategory[category.slug] || []).length > 0;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      <main className="container flex-1 mx-auto pt-24 px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <MenuBanner />
          <MenuSearchBar initialQuery={query} />

          <div className="flex flex-col md:flex-row gap-8">
            <CategoriesSidebar categories={categories} />

            <section className="flex-1 flex flex-col gap-14">
              {normalizedQuery && (
                <div>
                  <h2 className="text-2xl font-bold text-[#3D5690]">
                    Search results for "{query}"
                  </h2>
                  <p className="text-[#3D5690]/70 font-semibold mt-1">
                    {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'} found
                  </p>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {filteredProducts.map((product) => {
                        const categoryImage = categories.find((c) => c.slug === product.category.slug)?.image_url;

                        return (
                          <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.name}
                            price={formatPrice(product.base_price)}
                            imageSrc={product.image_url || categoryImage || '/hotCoffee.png'}
                            description={product.description || undefined}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-[#D9D9D9] rounded-2xl p-8 border border-[#3D5690]/10 mt-6">
                      <h3 className="text-xl font-bold text-[#3D5690] mb-2">No products found</h3>
                      <p className="text-[#3D5690]/70 font-semibold">
                        Try another keyword or browse by category from the sidebar.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!normalizedQuery && visibleCategories.map((category) => {
                const categoryProducts = productsByCategory[category.slug] || [];
                const previewProducts = categoryProducts.slice(0, 3);

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