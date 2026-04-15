"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBackendCart } from '../src/data/cartApi';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Loading...'); 
  const [userEmail, setUserEmail] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
          setUserEmail(data.email);
          if (data.phone) {
            localStorage.setItem('userPhone', data.phone);
          }
          // Sync exact name back to local storage globally too
          localStorage.setItem('userName', data.name);
        } else {
          // Token is invalid/expired
          handleSignOut();
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    const fetchCartCount = async (token: string) => {
      try {
        const cart = await getBackendCart(token);
        const count = Array.isArray(cart?.items)
          ? cart.items.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 0), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    // Look for the auth token right when the Navigation bar loads
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const storedName = localStorage.getItem('userName');
    
    if (token) {
      setIsLoggedIn(true);
      if (storedName) {
        setUserName(storedName);
      }
      fetchUserData(token);
      fetchCartCount(token);
    }

    const onCartUpdated = () => {
      const refreshedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (refreshedToken) {
        fetchCartCount(refreshedToken);
      }
    };

    window.addEventListener('cart-updated', onCartUpdated);
    return () => window.removeEventListener('cart-updated', onCartUpdated);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setCartCount(0);
    router.push('/login');
  };

  return (
    <nav className="container mx-auto px-4 pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <span 
            className="text-3xl font-bold text-[#3D5690] cursor-pointer"
            onClick={() => router.push('/')}
          >
            SkipLine
          </span>
          
          <div className="flex items-center gap-6">
            <a href="/menu" className="text-[#3D5690] font-bold text-lg hover:opacity-80 transition-opacity">
              Menu
            </a>
            
            {isLoggedIn ? (
              // Logged in State
              <>
                <button
                  onClick={() => router.push('/cart')}
                  className="relative text-[#3D5690] hover:text-[#2F4477] transition-colors focus:outline-none"
                  aria-label="Open cart"
                >
                  <ShoppingBag size={32} strokeWidth={2.2} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-11 h-11 bg-[#3D5690] text-[#EDEBDF] rounded-full flex items-center justify-center text-xl font-bold hover:bg-[#2F4477] transition-all focus:outline-none shadow-sm ml-1"
                  >
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right">
                        <div className="px-5 py-4 border-b border-gray-100">
                          <p className="text-base font-bold text-[#3D5690]">{userName}</p>
                          <p className="text-sm text-gray-500 truncate mt-0.5">{userEmail}</p>
                        </div>
                        <div className="py-2 border-b border-gray-100">
                          <a href="#" className="block px-5 py-2.5 text-sm text-[#3D5690] font-semibold hover:bg-gray-50">
                            My Orders
                          </a>
                          <a href="#" className="block px-5 py-2.5 text-sm text-[#3D5690] font-semibold hover:bg-gray-50">
                            Profile
                          </a>
                        </div>
                        <div className="py-2">
                          <button 
                            onClick={handleSignOut}
                            className="w-full text-left px-5 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 focus:outline-none"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              // Guest State
              <button 
                onClick={() => router.push('/login')}
                className="bg-[#3D5690] text-[#EDEBDF] font-bold rounded-[5px] px-6 py-2 hover:bg-opacity-90 transition-all focus:outline-none"
              >
                Order Now
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;