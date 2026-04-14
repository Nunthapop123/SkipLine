"use client";

import React, { useMemo, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CartHeader from '../../../components/cart/CartHeader';
import CartItemCard from '../../../components/cart/CartItemCard';
import CartActions from '../../../components/cart/CartActions';
import type { CartItem } from '../../../components/cart/types';

const initialCartItems: CartItem[] = [
    {
        id: 'item-1',
        name: 'Ice Coffee',
        image: '/iceCoffee.png',
        sizeLabel: 'Small (12 Oz)',
        sweetness: 50, 
        basePrice: 19.99,
        quantity: 1,
        addOns: [],
        showDetails: false,
    },
    {
        id: 'item-2',
        name: 'Ice Coffee',
        image: '/tea.png',
        sizeLabel: 'Small (12 Oz)',
        sweetness: 100, 
        basePrice: 19.99,
        quantity: 1,
        addOns: [
            { id: 'addon-1', name: 'Mocha Sauce', price: 2 },
            { id: 'addon-2', name: 'Whip cream', price: 3 },
        ],
        showDetails: true,
    },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

    const updateQuantity = (itemId: string, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id !== itemId) return item;
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            })
        );
    };

    const toggleDetails = (itemId: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, showDetails: !item.showDetails } : item
            )
        );
    };

    const removeAddOn = (itemId: string, addOnId: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, addOns: item.addOns.filter((addOn) => addOn.id !== addOnId) }
                    : item
            )
        );
    };

    const getItemUnitTotal = (item: CartItem) => {
        const addOnTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
        return item.basePrice + addOnTotal;
    };

    const cartTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + getItemUnitTotal(item) * item.quantity, 0),
        [cartItems]
    );

    const cartItemCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
            <Navbar />

            <main className="container flex-1 mx-auto pt-16 pb-16 px-4">
                <div className="mx-auto max-w-6xl">
                    <section className="w-full rounded-[10px] py-8">
                        <CartHeader cartItemCount={cartItemCount} cartTotal={cartTotal} />

                        <div>
                            {cartItems.map((item) => (
                                <CartItemCard
                                    key={item.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    toggleDetails={toggleDetails}
                                    removeAddOn={removeAddOn}
                                    getItemUnitTotal={getItemUnitTotal}
                                />
                            ))}
                        </div>

                        <CartActions />
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}