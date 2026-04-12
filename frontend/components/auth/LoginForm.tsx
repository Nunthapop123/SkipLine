"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.detail || 'Invalid email or password');
      } else {
        // Success! Store the token securely in localStorage for now
        localStorage.setItem('token', data.access_token);
        
        // Redirect to dashboard or home
        window.location.href = '/'; 
      }
    } catch (err) {
      setError('Cannot connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-[#D9D9D9] rounded-3xl p-10 mb-8 shadow-sm">
      <h2 className="text-3xl font-bold text-[#3D5690] mb-3">Welcome back</h2>
      <p className="text-[#3D5690] text-base mb-8">Sign in to order ahead and skip the queue.</p>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email" 
            className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password" 
            className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full bg-[#3D5690] text-[#EDEBDF] rounded-xl py-3.5 text-base mt-2 font-bold hover:bg-[#2F4477] focus:outline-none transform transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1'}`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
        
        <div className="text-center mt-3">
          <p className="text-[#3D5690] text-sm hidden sm:block">
            By continuing you agree to SkipLine&apos;s <a href="#" className="underline hover:opacity-80">Terms</a> and <a href="#" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
          <p className="text-[#3D5690] text-xs sm:hidden">
            By continuing you agree to SkipLine&apos;s <br /><a href="#" className="underline hover:opacity-80">Terms</a> and <a href="#" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;