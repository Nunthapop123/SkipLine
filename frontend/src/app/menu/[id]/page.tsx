"use client";

import React, { useState } from 'react';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import ProductImage from '../../../../components/menu/(individual)/ProductImage';
import ProductInfo from '../../../../components/menu/(individual)/ProductInfo';
import SizeSelector from '../../../../components/menu/(individual)/SizeSelector';
import SweetnessSelector from '../../../../components/menu/(individual)/SweetnessSelector';
import AddOnSection from '../../../../components/menu/(individual)/AddOnSection';
import QuantitySelector from '../../../../components/menu/(individual)/QuantitySelector';
import RelatedProducts from '../../../../components/menu/(individual)/RelatedProducts';

const MenuItemPage = ({ params }: { params: { id: string } }) => {
  const [size, setSize] = useState('Small');
  const [sweetness, setSweetness] = useState('50%');
  const [quantity, setQuantity] = useState(1);

  // Fallback Product mock data 
  const product = {
    title: 'Milk Tea',
    price: 20,
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting simply dummy simply dummy',
    image: '/frappes.png'
  };

  const sizes = [
    { name: 'Small', volume: '12 Oz', priceAdd: 0, imageScale: 48, icon: '/smallCup.png' },
    { name: 'Medium', volume: '16 Oz', priceAdd: 4, imageScale: 56, icon: '/mediumCup.png' },
    { name: 'Large', volume: '20 Oz', priceAdd: 8, imageScale: 64, icon: '/largeCup.png' }
  ];

  const sweetnessLevels = ['0%', '25%', '50%', '75%', '100%'];

  const calculateTotal = () => {
    const sizeObj = sizes.find(s => s.name === size);
    const addedPrice = sizeObj ? sizeObj.priceAdd : 0;
    return (product.price + addedPrice) * quantity;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      
      <main className="container flex-1 mx-auto pt-24 pb-0 px-4">
        
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            <ProductImage image={product.image} title={product.title} />

            <div className="w-full lg:w-7/12 flex flex-col justify-start">
              
              <ProductInfo 
                title={product.title} 
                price={calculateTotal()} 
                description={product.description} 
              />

              <SizeSelector 
                sizes={sizes}
                selectedSize={size}
                onSizeChange={setSize}
              />

              <SweetnessSelector 
                levels={sweetnessLevels}
                selectedLevel={sweetness}
                onLevelChange={setSweetness}
              />

              <AddOnSection />

              <QuantitySelector 
                quantity={quantity}
                onQuantityChange={setQuantity}
              />

              <button className="w-full bg-[#3D5690] text-[#EDEBDF] font-bold text-lg py-3.5 rounded-xl hover:bg-[#2F4477] transition-all duration-200 shadow-[0_8px_30px_rgb(61,86,144,0.2)] hover:shadow-[0_8px_30px_rgb(61,86,144,0.3)] hover:-translate-y-1 active:translate-y-0">
                Add to Cart
              </button>
              
            </div>
          </div>
          
        </div>

        <RelatedProducts />

      </main>

      <Footer />
    </div>
  );
};

export default MenuItemPage;