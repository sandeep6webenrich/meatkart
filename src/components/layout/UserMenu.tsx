'use client';

import Link from 'next/link';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Link href="/login">
        <button className="flex items-center gap-2 p-2 px-3 hover:bg-stone-100 rounded-full transition-colors text-sm font-medium">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-1 hover:bg-stone-100 rounded-full transition-colors border border-transparent hover:border-stone-200"
      >
        <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <div className="h-8 w-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 border-b border-stone-100 mb-2">
            <p className="text-sm font-medium text-stone-900 truncate">{user.name}</p>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
          </div>

          {user.role === 'admin' ? (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          ) : (
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              My Account
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
