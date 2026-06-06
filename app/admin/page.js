'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('shunyamarg@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#faf9f6] flex flex-col items-center justify-center z-50 font-sans">
      <div className="w-full max-w-sm px-6">
        <h1 className="font-serif text-3xl font-light mb-2 text-[#1c1b18] text-center">
          ShunyaMarg Admin
        </h1>
        <p className="text-[#8c877f] text-sm mb-8 text-center">
          Authenticate to access the cockpit
        </p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white font-sans text-sm text-[#1c1b18] outline-none focus:border-[#b8935a] transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white font-sans text-sm text-[#1c1b18] outline-none focus:border-[#b8935a] transition-colors"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1c1b18] text-[#faf9f6] border-none rounded-sm font-sans text-xs tracking-widest uppercase cursor-pointer hover:bg-[#2e2d29] transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Enter →'}
          </button>
          
          {error && (
            <div className="text-[#b85a5a] text-xs mt-3 text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
