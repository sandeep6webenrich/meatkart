'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NavbarCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // We'll create a simple API for this or just reuse the admin one if appropriate,
        // but for public facing, it's better to have a public endpoint.
        // For now, let's assume we can fetch from a public API route we'll create.
        const res = await fetch('/api/categories'); 
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }

    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center gap-1 hover:text-green-600 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        Categories
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-stone-100 py-2 transition-all duration-200 origin-top-left z-50 ${
          isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        <div className="px-4 py-2 border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Browse By</span>
        </div>
        <div className="py-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="block px-4 py-2 text-sm text-stone-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
