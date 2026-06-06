'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Library, Upload, Inbox, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center font-sans">Loading...</div>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Cards', href: '/admin/dashboard/cards', icon: Library },
    { name: 'Bulk Import', href: '/admin/dashboard/import', icon: Upload },
    { name: 'Submissions', href: '/admin/dashboard/submissions', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-[#f4f2ed] font-sans flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-[220px] bg-[#1c1b18] text-[#faf9f6] flex flex-col z-50">
        <div className="p-6 pb-4 border-b border-white/10">
          <h2 className="font-serif text-xl font-light text-white mb-1">ShunyaMarg</h2>
          <span className="text-[11px] text-white/35 tracking-widest uppercase">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-[13px] transition-colors ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={16} className="opacity-80" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-[11px] text-white/35 hover:text-white transition-colors px-2 py-1">
            <ArrowLeft size={12} /> View live site
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] text-white/35 hover:text-white transition-colors w-full text-left px-2 py-1"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[220px] p-8 min-h-screen flex-1 text-[#1c1b18]">
        {children}
      </main>
    </div>
  );
}
