"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CartHeader from '../../../components/cart/CartHeader';
import CartItemCard from '../../../components/cart/CartItemCard';
import CartActions from '../../../components/cart/CartActions';
import RemoveItemModal from '../../../components/cart/RemoveItemModal';
import { getBackendCart, updateCartItemQuantity, removeCartItem } from '../../data/cartApi';
import type { CartItem as ApiCartItem } from '../../data/cartApi';
import type { CartItem } from '../../../components/cart/types';

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingRemoveItem, setPendingRemoveItem] = useState<CartItem | null>(null);

    // Load cart from backend on mount
    useEffect(() => {
        const loadCart = async () => {
            setIsLoading(true);
            try {
                const token = typeof window !== 'undefined'
                    ? (localStorage.getItem('token') || localStorage.getItem('auth_token'))
                    : null;

                if (!token) {
                    // Not authenticated - redirect to login
                    router.push('/login');
                    return;
                }

                const backendCart = await getBackendCart(token);
                if (backendCart && backendCart.items && Array.isArray(backendCart.items)) {
                    // Transform backend CartItem[] to component CartItem[]
                    const transformedItems: CartItem[] = (backendCart.items as any[]).map((apiItem: any) => ({
                        id: String(apiItem.id),
                        name: apiItem.product?.name || 'Unknown Product',
                        image: apiItem.product?.image_url || '/placeholder.png',
                        sizeLabel: apiItem.size,
                        sweetness: apiItem.sweetness_level || 50,
                        basePrice: Number(apiItem.unit_price || 0),
                        quantity: apiItem.quantity || 1,
                        addOns: (apiItem.add_ons || apiItem.addOns || []).map((addon: any) => ({
                            id: String(addon.id),
                            name: addon.name,
                            price: Number(addon.price),
                        })),
                        showDetails: false,
                    }));
                    setCartItems(transformedItems);
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, [router]);

    const updateQuantity = async (itemId: string, delta: number) => {
        const token = typeof window !== 'undefined'
            ? (localStorage.getItem('token') || localStorage.getItem('auth_token'))
            : null;
        if (!token) return;

        const item = cartItems.find((i) => i.id === itemId);
        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
            // Show remove confirmation
            setPendingRemoveItem(item);
            return;
        }

        try {
            await updateCartItemQuantity(parseInt(itemId, 10), newQuantity, token);
            setCartItems((prev) =>
                prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
            );
            window.dispatchEvent(new Event('cart-updated'));
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const confirmRemoveItem = async () => {
        if (!pendingRemoveItem) return;

        const token = typeof window !== 'undefined'
            ? (localStorage.getItem('token') || localStorage.getItem('auth_token'))
            : null;
        if (!token) return;

        try {
            await removeCartItem(parseInt(pendingRemoveItem.id, 10), token);
            setCartItems((prev) => prev.filter((item) => item.id !== pendingRemoveItem.id));
            setPendingRemoveItem(null);
            window.dispatchEvent(new Event('cart-updated'));
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const cancelRemoveItem = () => {
        setPendingRemoveItem(null);
    };

    const toggleDetails = (itemId: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, showDetails: !item.showDetails } : item
            )
        );
    };

    const removeAddOn = (itemId: string, addOnId: string) => {
        // Note: This would require backend support to remove individual add-ons
        // For now, just update local state
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

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
                <Navbar />
                <main className="container flex-1 mx-auto pt-16 pb-16 px-4">
                    <div className="mx-auto max-w-6xl text-[#3D5690] text-lg font-semibold">Loading cart...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
            <Navbar />

            <main className="container flex-1 mx-auto pt-16 pb-16 px-4">
                <div className="mx-auto max-w-6xl">
                    <section className="w-full rounded-[10px] py-8">
                        <CartHeader cartItemCount={cartItemCount} cartTotal={cartTotal} />

                        {cartItems.length === 0 ? (
                            <div className="text-center py-12 text-[#3D5690] text-lg">
                                Your cart is empty
                            </div>
                        ) : (
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
                        )}

                        <CartActions />
                    </section>
                </div>
            </main>

            <Footer />

            <RemoveItemModal
                isOpen={Boolean(pendingRemoveItem)}
                itemName={pendingRemoveItem?.name ?? ''}
                onCancel={cancelRemoveItem}
                onConfirm={confirmRemoveItem}
            />
        </div>
    );
}