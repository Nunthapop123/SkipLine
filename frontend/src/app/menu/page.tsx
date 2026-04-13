import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/menu/ProductCard';
import { Search, ArrowRight } from 'lucide-react';

const MenuPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      
      <main className="container flex-1 mx-auto pt-24 px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          
          <div className="w-full bg-[#D9D9D9] rounded-2xl py-24 flex items-center justify-center mb-10 shadow-sm border border-[#3D5690]/5">
            <h2 className="text-4xl font-bold text-[#3D5690] opacity-90">
              (Promotions/Products Banner)
            </h2>
          </div>

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

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-[#D9D9D9] rounded-2xl p-6 shadow-sm sticky top-32 border border-[#3D5690]/5">
                <h3 className="text-lg font-bold text-[#3D5690] mb-4 pb-4 border-b-2 border-[#3D5690]">
                  Categories
                </h3>
                <ul className="flex flex-col space-y-1">
                  <li><a href="#" className="block w-full px-4 py-2.5 rounded-xl bg-[#3D5690]/10 font-bold text-[#3D5690] text-base transition-all">Hot Coffee</a></li>
                  <li><a href="#" className="block w-full px-4 py-2.5 rounded-xl hover:bg-[#3D5690]/5 font-semibold text-[#3D5690] text-base transition-all">Ice Coffee</a></li>
                  <li><a href="#" className="block w-full px-4 py-2.5 rounded-xl hover:bg-[#3D5690]/5 font-semibold text-[#3D5690] text-base transition-all">Tea & Matcha</a></li>
                  <li><a href="#" className="block w-full px-4 py-2.5 rounded-xl hover:bg-[#3D5690]/5 font-semibold text-[#3D5690] text-base transition-all">Frappes & Blended</a></li>
                  <li><a href="#" className="block w-full px-4 py-2.5 rounded-xl hover:bg-[#3D5690]/5 font-semibold text-[#3D5690] text-base transition-all mb-1">Non-Coffee & Refreshers</a></li>
                </ul>
              </div>
            </aside>

            <section className="flex-1 flex flex-col gap-14">
            
              <div>
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#3D5690]">Hot Coffee</h2>
                  <a href="#" className="flex items-center gap-1.5 text-[#3D5690] text-base font-bold hover:opacity-70 transition-opacity">
                    See More <ArrowRight size={16} strokeWidth={2.5} />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductCard title="Espresso" price="19.99" imageSrc="/hotCoffee.png" />
                  <ProductCard title="Americano" price="23.99" imageSrc="/hotCoffee.png" />
                  <ProductCard title="Cappuccino" price="21.99" imageSrc="/hotCoffee.png" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#3D5690]">Ice Coffee</h2>
                  <a href="#" className="flex items-center gap-1.5 text-[#3D5690] text-base font-bold hover:opacity-70 transition-opacity">
                    See More <ArrowRight size={16} strokeWidth={2.5} />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductCard title="Iced Espresso" price="24.99" imageSrc="/iceCoffee.png" />
                  <ProductCard title="Iced Americano" price="26.99" imageSrc="/iceCoffee.png" />
                  <ProductCard title="Iced Cappuccino" price="28.99" imageSrc="/iceCoffee.png" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#3D5690]">Tea & Matcha</h2>
                  <a href="#" className="flex items-center gap-1.5 text-[#3D5690] text-base font-bold hover:opacity-70 transition-opacity">
                    See More <ArrowRight size={16} strokeWidth={2.5} />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductCard title="Hot Green Tea" price="18.99" imageSrc="/tea.png" />
                  <ProductCard title="Matcha Latte" price="24.99" imageSrc="/tea.png" />
                  <ProductCard title="Iced Peach Tea" price="19.99" imageSrc="/tea.png" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#3D5690]">Frappes & Blended</h2>
                  <a href="#" className="flex items-center gap-1.5 text-[#3D5690] text-base font-bold hover:opacity-70 transition-opacity">
                    See More <ArrowRight size={16} strokeWidth={2.5} />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductCard title="Mocha Frappe" price="29.99" imageSrc="/frappes.png" />
                  <ProductCard title="Caramel Blend" price="28.99" imageSrc="/frappes.png" />
                  <ProductCard title="Vanilla Bean" price="27.99" imageSrc="/frappes.png" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#3D5690]">Non-Coffee & Refreshers</h2>
                  <a href="#" className="flex items-center gap-1.5 text-[#3D5690] text-base font-bold hover:opacity-70 transition-opacity">
                    See More <ArrowRight size={16} strokeWidth={2.5} />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductCard title="Strawberry Refresher" price="22.99" imageSrc="/nonCoffee.png" />
                  <ProductCard title="Mango Dragonfruit" price="24.99" imageSrc="/nonCoffee.png" />
                  <ProductCard title="Classic Lemonade" price="16.99" imageSrc="/nonCoffee.png" />
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

export default MenuPage;