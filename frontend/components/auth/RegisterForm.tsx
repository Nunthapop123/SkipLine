"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // Pure validation checkers (no longer updating React state value)
  const validateName = (val: string) => {
    if (!val.trim()) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
    } else if (!/^[A-Za-z\s\-]+$/.test(val)) {
      setErrors(prev => ({ ...prev, name: 'Letters, spaces, and hyphens only' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setErrors(prev => ({ ...prev, email: 'Enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validatePhone = (val: string) => {
    if (val.trim() && !/^\d{10}$/.test(val.trim())) {
      setErrors(prev => ({ ...prev, phone: 'Phone must be exactly 10 digits' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
    } else if (val.length <= 4) {
      setErrors(prev => ({ ...prev, password: 'Must be longer than 4 characters' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
    
    if (confirmPassword && val !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else if (confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const validateConfirmPassword = (val: string) => {
    if (!val) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Confirm Password is required' }));
    } else if (val !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Force validate everything on submit
    validateName(name);
    validateEmail(email);
    validatePhone(phone);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    if (!name.trim() || !email.trim() || !password || !confirmPassword || Object.values(errors).some(err => err !== '')) {
      setSubmitError('Please fix the errors highlighted in red above.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setSubmitError(data.detail || 'Registration failed');
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setSubmitError('Cannot connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-[#D9D9D9] rounded-3xl p-10 mb-8 shadow-sm">
      <h2 className="text-3xl font-bold text-[#3D5690] mb-3">Create your account</h2>
      <p className="text-[#3D5690] text-base mb-8">Fill in your details to get started</p>
      
      {submitError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium border border-red-200">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => { 
                setName(e.target.value); 
                if(errors.name) validateName(e.target.value); 
            }}
            onBlur={(e) => validateName(e.target.value)}
            required
            placeholder="Enter your name (John Doe)" 
            className={`w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 hover:border-[#3D5690]/50 focus:outline-none transition-all placeholder:text-[#3D5690]/60 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3D5690]'}`} 
          />
          {errors.name && <p className="text-red-500 text-xs ml-1 font-medium">{errors.name}</p>}
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => { 
                setEmail(e.target.value); 
                if(errors.email) validateEmail(e.target.value); 
            }}
            onBlur={(e) => validateEmail(e.target.value)}
            required
            placeholder="Enter your email (e.g. johndoe@hotmail.com)" 
            className={`w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 hover:border-[#3D5690]/50 focus:outline-none transition-all placeholder:text-[#3D5690]/60 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3D5690]'}`} 
          />
          {errors.email && <p className="text-red-500 text-xs ml-1 font-medium">{errors.email}</p>}
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">
            Phone number (optional)
          </label>
          <input 
            type="text" 
            value={phone}
            onChange={(e) => { 
                setPhone(e.target.value); 
                if(errors.phone) validatePhone(e.target.value); 
            }}
            onBlur={(e) => validatePhone(e.target.value)}
            placeholder="Enter your phone number (e.g. 0123456789)" 
            className={`w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 hover:border-[#3D5690]/50 focus:outline-none transition-all placeholder:text-[#3D5690]/60 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3D5690]'}`} 
          />
          {errors.phone && <p className="text-red-500 text-xs ml-1 font-medium">{errors.phone}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => { 
                setPassword(e.target.value); 
                if(errors.password) validatePassword(e.target.value); 
            }}
            onBlur={(e) => validatePassword(e.target.value)}
            required
            placeholder="Enter your password" 
            className={`w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 hover:border-[#3D5690]/50 focus:outline-none transition-all placeholder:text-[#3D5690]/60 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3D5690]'}`} 
          />
          {errors.password && <p className="text-red-500 text-xs ml-1 font-medium">{errors.password}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => { 
                setConfirmPassword(e.target.value); 
                if(errors.confirmPassword) validateConfirmPassword(e.target.value); 
            }}
            onBlur={(e) => validateConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password" 
            className={`w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 hover:border-[#3D5690]/50 focus:outline-none transition-all placeholder:text-[#3D5690]/60 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3D5690]'}`} 
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs ml-1 font-medium">{errors.confirmPassword}</p>}
        </div>  
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full bg-[#3D5690] text-[#EDEBDF] rounded-xl py-3.5 text-base mt-2 font-bold hover:bg-[#2F4477] focus:outline-none transform transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1'}`}
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
        
        <div className="text-center mt-3">
          <p className="text-[#3D5690] text-sm hidden sm:block">
            By creating an account you agree to SkipLine <a href="#" className="underline hover:opacity-80">Terms of Service</a> and <a href="#" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;