import Link from 'next/link'
import { Menu, Search } from 'lucide-react'
import CartIcon from './CartIcon'
import NavbarCategories from './NavbarCategories'
import UserMenu from './UserMenu'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 text-stone-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-700">United Healthcare</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-500">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-green-600 transition-colors">Products</Link>
            <NavbarCategories />
            <Link href="/about" className="hover:text-green-600 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-green-600 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative w-full max-w-sm items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="search"
                placeholder="Search products..."
                className="flex h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px] lg:w-[300px]"
              />
            </div>
            
            <CartIcon />
            
            <UserMenu />

            <button className="md:hidden p-2 hover:bg-stone-100 rounded-full transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
