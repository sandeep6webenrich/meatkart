import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, FileBarChart, UserSquare2 } from "lucide-react";
import { Toaster } from "sonner";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "MeatKart Admin",
  description: "Admin Dashboard for MeatKart",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <div className="tw-flex tw-h-screen tw-bg-gray-50">
          {/* Sidebar */}
          <aside className="tw-w-64 tw-bg-white tw-shadow-xl tw-flex tw-flex-col tw-border-r tw-border-gray-200">
            <div className="tw-p-6 tw-border-b tw-border-gray-100 tw-bg-white">
              <div className="tw-flex tw-items-center tw-justify-center">
                 <Link href="/">
                    <img src="/images/logo.png" alt="MeatKart" className="tw-h-12 tw-w-auto" />
                 </Link>
              </div>
            </div>
            <nav className="tw-flex-1 tw-p-4 tw-space-y-1">
              <p className="tw-px-4 tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase tw-tracking-wider tw-mb-3 tw-mt-2">Menu</p>
              <Link
                href="/admin"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <LayoutDashboard size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Dashboard</span>
              </Link>
              <Link
                href="/admin/categories"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <Package size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Categories</span>
              </Link>
              <Link
                href="/admin/products"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <Package size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Products</span>
              </Link>
              <Link
                href="/admin/orders"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <ShoppingCart size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Orders</span>
              </Link>
              <Link
                href="/admin/customers"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <UserSquare2 size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Customers</span>
              </Link>
              <Link
                href="/admin/reports"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <FileBarChart size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Reports</span>
              </Link>
              
              <p className="tw-px-4 tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase tw-tracking-wider tw-mt-8 tw-mb-3">System</p>
              <Link
                href="/admin/users"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <Users size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Admin Users</span>
              </Link>
              <Link
                href="/admin/settings"
                className="tw-flex tw-items-center tw-space-x-3 tw-px-4 tw-py-3 tw-text-gray-600 hover:tw-bg-red-50 hover:tw-text-primary tw-rounded-lg tw-transition-all tw-group"
              >
                <Settings size={20} className="tw-text-gray-400 group-hover:tw-text-primary" />
                <span className="tw-font-medium">Settings</span>
              </Link>
            </nav>
            <div className="tw-p-4 tw-border-t tw-border-gray-100">
              <LogoutButton />
            </div>
          </aside>

          {/* Main Content */}
          <main className="tw-flex-1 tw-overflow-y-auto tw-p-8 tw-bg-gray-50">
            <div className="tw-max-w-7xl tw-mx-auto">
                {children}
            </div>
          </main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
