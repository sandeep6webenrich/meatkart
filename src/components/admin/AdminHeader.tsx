'use client';

import { User } from 'lucide-react';
import AdminNotifications from './AdminNotifications';

export default function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-stone-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <AdminNotifications />
        
        <div className="h-8 w-px bg-stone-200" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-stone-900">Admin User</p>
            <p className="text-xs text-stone-500">admin@united.com</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
