"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import ProductImage from '../../../../components/menu/(individual)/ProductImage';
import ProductInfo from '../../../../components/menu/(individual)/ProductInfo';
import SizeSelector from '../../../../components/menu/(individual)/SizeSelector';
import SweetnessSelector from '../../../../components/menu/(individual)/SweetnessSelector';
import AddOnDisplay from '../../../../components/menu/(individual)/AddOnDisplay';
import AddOnModal from '../../../../components/menu/(individual)/AddOnModal';
import QuantitySelector from '../../../../components/menu/(individual)/QuantitySelector';
import RelatedProducts from '../../../../components/menu/(individual)/RelatedProducts';
import { getMenuProductById, type MenuProduct } from '../../../data/menuApi';

interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string;
}

const cupMeta: Record<string, { volume: string; imageScale: number; icon: string }> = {
  small: { volume: '12 Oz', imageScale: 48, icon: '/smallCup.png' },
  medium: { volume: '16 Oz', imageScale: 56, icon: '/mediumCup.png' },
  large: { volume: '20 Oz', imageScale: 64, icon: '/largeCup.png' },
};

const MenuItemPage = () => {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  const [product, setProduct] = useState<MenuProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [size, setSize] = useState('Small');
  const [sweetness, setSweetness] = useState('50%');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const result = Number.isNaN(productId) ? null : await getMenuProductById(productId);
      setProduct(result);
      setIsLoading(false);
    };

    loadProduct();
  }, [productId]);

  const handleRemoveAddOn = (id: string) => {
    setSelectedAddOns((prev) => prev.filter((item) => item.id !== id));
  };

  const availableAddOns = useMemo(() => {
    if (!product) return [];
    return product.add_ons.map((item) => ({
      id: String(item.id),
      name: item.name,
      category: item.category,
      price: Number(item.price_adjustment),
    }));
  }, [product]);

  const productBasePrice = Number(product?.base_price || 0);

  const sizes = useMemo(() => {
    if (!product || product.sizes.length === 0) {
      return [
        { name: 'Small', volume: '12 Oz', priceAdd: 0, imageScale: 48, icon: '/smallCup.png' },
      ];
    }

    return product.sizes.map((item) => {
      const key = item.size_name.trim().toLowerCase();
      const meta = cupMeta[key] || { volume: '16 Oz', imageScale: 56, icon: '/mediumCup.png' };

      return {
        name: item.size_name,
        volume: meta.volume,
        priceAdd: Number(item.price_adjustment),
        imageScale: meta.imageScale,
        icon: meta.icon,
      };
    });
  }, [product]);

  useEffect(() => {
    if (sizes.length > 0 && !sizes.some((item) => item.name === size)) {
      setSize(sizes[0].name);
    }
  }, [sizes, size]);

  const sweetnessLevels = ['0%', '25%', '50%', '75%', '100%'];

  const calculateTotal = () => {
    const sizeObj = sizes.find(s => s.name === size);
    const addedPrice = sizeObj ? sizeObj.priceAdd : 0;
    const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
    return Number(((productBasePrice + addedPrice + addOnsTotal) * quantity).toFixed(2));
  };

  useEffect(() => {
    setSelectedAddOns((prev) => prev.filter((selected) => availableAddOns.some((item) => item.id === selected.id)));
  }, [availableAddOns]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
        <Navbar />
        <main className="container flex-1 mx-auto pt-24 pb-20 px-4">
          <div className="mx-auto max-w-6xl text-[#3D5690] text-xl font-bold">Loading menu item...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
        <Navbar />
        <main className="container flex-1 mx-auto pt-24 pb-20 px-4">
          <div className="mx-auto max-w-6xl text-[#3D5690] text-xl font-bold">Menu item not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      
      <main className="container flex-1 mx-auto pt-24 pb-0 px-4">
        
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            <ProductImage image={product.image_url || '/hotCoffee.png'} title={product.name} />

            <div className="w-full lg:w-7/12 flex flex-col justify-start">
              
              <ProductInfo 
                title={product.name} 
                price={calculateTotal()} 
                description={product.description || 'No description available.'} 
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

              <AddOnDisplay 
                addOns={selectedAddOns}
                onEdit={() => setIsAddOnModalOpen(true)}
                onRemove={handleRemoveAddOn}
              />

              <AddOnModal 
                isOpen={isAddOnModalOpen}
                onClose={() => setIsAddOnModalOpen(false)}
                onDone={setSelectedAddOns}
                selectedAddOns={selectedAddOns}
                availableAddOns={availableAddOns}
              />

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