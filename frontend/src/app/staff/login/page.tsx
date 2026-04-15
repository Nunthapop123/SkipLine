'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StaffLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'Staff' | 'Admin'>('Staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Invalid credentials');
        setLoading(false);
        return;
      }

      const data = await response.json();
      const userRole = data.user?.role;

      // Check if user has staff or admin role
      if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
        setError('Access denied. Only staff and admin accounts can log in here.');
        setLoading(false);
        return;
      }

      // Check if role matches selected tab
      const expectedRole = role === 'Staff' ? 'STAFF' : 'ADMIN';
      if (userRole !== expectedRole) {
        setError(`This account is not registered as a ${role} account.`);
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to staff dashboard
      router.push('/staff/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F1E9] font-sans px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-7rem)]">
        <div className="w-full overflow-hidden rounded-xl border border-[#DBD8CF] bg-[#F3F1E9] shadow-md">
          <div className="flex w-full min-h-190">
          
          {/* Left Blue Panel */}
          <div className="hidden md:flex flex-col w-1/2 bg-[#4C6291] text-white p-12 relative rounded-l-md">
            
            {/* Blank App Icon Placeholder */}
            <div className="w-16 h-16 bg-[#E8E6DF] rounded-xl mb-6 shadow-sm"></div>
            
            <h2 className="text-2xl font-bold mb-1">SkipLine</h2>
            <p className="text-[#A5B4D4] text-lg mb-20 font-medium">Staff Portal</p>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Manage orders with<br/>confidence
            </h1>
            
            <p className="text-lg text-[#C8D3E8] mb-10 max-w-sm leading-relaxed">
              Your back-office for queue management, order tracking, and store operations.
            </p>

            <ul className="space-y-4 text-[#C8D3E8] mb-auto">
              <li className="flex items-center gap-3 text-lg">
                <span className="w-1.5 h-1.5 bg-[#C8D3E8] rounded-full"></span>
                Live queue & order dashboard
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="w-1.5 h-1.5 bg-[#C8D3E8] rounded-full"></span>
                Menu & availability management
              </li>
            </ul>

            <div className="mt-auto pt-8">
              <p className="text-sm text-[#A5B4D4]">© 2026 SkipLine · Internal use only</p>
            </div>
          </div>

          {/* Right Beige Panel (Login Form) */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-16 py-12">
            <h2 className="text-3xl font-bold text-[#465985] mb-3">Sign in</h2>
            <p className="text-[#7A8AAB] font-medium mb-8">Use your pre-registered SkipLine account</p>

            {/* Toggle Switch */}
            <div className="flex p-1 bg-[#E4E2DC] rounded-xl mb-8">
              <button
                onClick={() => setRole('Staff')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  role === 'Staff' 
                    ? 'bg-[#4C6291] text-white shadow-md' 
                    : 'text-[#7A8AAB] hover:bg-[#D9D7D1] hover:text-[#465985]'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setRole('Admin')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  role === 'Admin' 
                    ? 'bg-[#4C6291] text-white shadow-md' 
                    : 'text-[#7A8AAB] hover:bg-[#D9D7D1] hover:text-[#465985]'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Form Fields */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-[#7A8AAB] mb-2">
                  Employee ID/Email <span className="text-[#7A8AAB]">*</span>
                </label>
                <input 
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your ID or Email"
                  className="w-full bg-[#E4E2DC] border-none rounded-lg px-4 py-3.5 text-[#465985] font-medium placeholder-[#A3ADC2] focus:ring-2 focus:ring-[#4C6291] outline-none"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#7A8AAB] mb-2">
                  Password <span className="text-[#7A8AAB]">*</span>
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#E4E2DC] border-none rounded-lg px-4 py-3.5 text-[#465985] font-medium placeholder-[#A3ADC2] focus:ring-2 focus:ring-[#4C6291] outline-none"
                  disabled={loading}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#4C6291] text-white font-bold py-3.5 rounded-lg hover:bg-[#34456a] transition-colors mt-4 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Back to Customer Login */}
            <div className="mt-8 text-center">
              <Link 
                href="/login" 
                className="text-sm font-semibold text-[#465985] hover:opacity-80 flex items-center justify-center gap-2"
              >
                <span>←</span> Back to customer login
              </Link>
            </div>
          </div>

        </div>
        </div>
      </main>
    </div>
  );
}