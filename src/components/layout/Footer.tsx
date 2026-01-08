import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">United Healthcare</h3>
            <p className="text-stone-400 mb-6">
              Premium herbal products for a healthier, balanced life. 100% Natural & Authentic.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-stone-400 hover:text-green-500 transition-colors">Home</Link></li>
              <li><Link href="/shop" className="text-stone-400 hover:text-green-500 transition-colors">Shop All</Link></li>
              <li><Link href="/about" className="text-stone-400 hover:text-green-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-stone-400 hover:text-green-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-stone-400 hover:text-green-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="text-stone-400 hover:text-green-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/shipping-policy" className="text-stone-400 hover:text-green-500 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="text-stone-400 hover:text-green-500 transition-colors">Refund Policy</Link></li>
              <li><Link href="/disclaimer" className="text-stone-400 hover:text-green-500 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-stone-400">
              <li>123 Herbal Street, Wellness City</li>
              <li>India - 400001</li>
              <li>support@unitedhealthcare.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 text-center text-stone-500 text-sm">
          <p>&copy; {new Date().getFullYear()} United Healthcare. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Disclaimer: These products are not intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
