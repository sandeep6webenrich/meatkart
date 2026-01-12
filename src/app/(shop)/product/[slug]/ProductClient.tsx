'use client'

import { useState } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';


import { useLocationStore } from '@/store/location-store'
import { toast } from 'sonner';
import { Truck, ShieldCheck, Share2, MapPin, ChevronDown } from 'lucide-react';

type ProductWeight = {
  id: string;
  weight: string;
  price: number;
}

type Product = {
  id: string;
  name: string;
  category: { name: string; slug: string };
  description: string | null;
  freshnessNotes: string | null;
  imageUrl: string;
  weights: ProductWeight[];
}

export default function ProductClient({ product }: { product: Product }) {
  const { city } = useLocationStore();
  const [checkPincode, setCheckPincode] = useState('');



  // Ensure selectedWeight has a valid structure even if weights are empty
  const [selectedWeight, setSelectedWeight] = useState<ProductWeight>(
    product.weights.length > 0
      ? product.weights[0]
      : { id: 'default', weight: 'N/A', price: 0 }
  );

  const handleCheckAvailability = () => {
    if (!checkPincode) {
      toast.error('Please enter a pincode');
      return;
    }
    // Mock check
    if (checkPincode.startsWith('5')) {
      toast.success(`Available in ${city} (${checkPincode})`);
    } else {
      toast.error(`Not available in ${checkPincode}`);
    }
  }

  const discount = selectedWeight.price > 0 ? Math.round((selectedWeight.price * 0.2)) : 0; // Mock discount logic for visual
  const finalPrice = selectedWeight.price;

  return (
    <div className="tw-bg-gray-50 tw-min-h-screen tw-pb-20">
      {/* Breadcrumbs */}
      <div className="tw-bg-white tw-border-b">
        <div className="tw-container tw-mx-auto tw-px-4 tw-py-3">
          <nav className="tw-text-sm tw-text-gray-500">
            <ol className="tw-list-none tw-p-0 tw-inline-flex">
              <li className="tw-flex tw-items-center">
                <Link href="/" className="hover:tw-text-primary">Home</Link>
                <span className="tw-mx-2">/</span>
              </li>
              <li className="tw-flex tw-items-center">
                <Link href={`/category/${product.category.slug}`} className="hover:tw-text-primary">{product.category.name}</Link>
                <span className="tw-mx-2">/</span>
              </li>
              <li className="tw-text-gray-900 tw-font-medium tw-truncate tw-max-w-[200px] sm:tw-max-w-none">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-8 lg:tw-gap-12">

          {/* Left Column: Images & Meta */}
          <div className="md:tw-col-span-6 lg:tw-col-span-5 tw-space-y-6">
            <div className="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 tw-overflow-hidden tw-relative tw-aspect-square tw-flex tw-items-center tw-justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="tw-w-full tw-h-full tw-object-cover hover:tw-scale-105 tw-transition-transform tw-duration-500"
              />
              {/* Badges could go here */}
            </div>

            {/* Service Guarantees */}
            <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-text-center tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-50">
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                <div className="tw-w-10 tw-h-10 tw-rounded-full tw-bg-primary/10 tw-flex tw-items-center tw-justify-center tw-text-primary">
                  <ShieldCheck size={20} />
                </div>
                <span className="tw-text-xs tw-font-medium tw-text-gray-600">Pure & Fresh</span>
              </div>
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                <div className="tw-w-10 tw-h-10 tw-rounded-full tw-bg-primary/10 tw-flex tw-items-center tw-justify-center tw-text-primary">
                  <Truck size={20} />
                </div>
                <span className="tw-text-xs tw-font-medium tw-text-gray-600">Fast Delivery</span>
              </div>
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                <div className="tw-w-10 tw-h-10 tw-rounded-full tw-bg-primary/10 tw-flex tw-items-center tw-justify-center tw-text-primary">
                  <img src="/images/halal.png" alt="Halal" className="tw-w-5 tw-h-5 tw-object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                <span className="tw-text-xs tw-font-medium tw-text-gray-600">100% Halal</span>
              </div>
            </div>

            {/* Check Availability */}
            <div className="tw-bg-blue-50 tw-p-4 tw-rounded-xl tw-border tw-border-blue-100">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
                <MapPin className="tw-text-blue-600" size={18} />
                <span className="tw-font-semibold tw-text-blue-900 tw-text-sm">Check Delivery Availability</span>
              </div>
              <form className="tw-flex tw-gap-2" onSubmit={(e) => { e.preventDefault(); handleCheckAvailability(); }}>
                <input
                  type="text"
                  className="tw-flex-1 tw-bg-white tw-border tw-border-blue-200 tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tweet-input-placeholder"
                  placeholder={`Enter pincode (e.g. ${city})`}
                  value={checkPincode}
                  onChange={(e) => setCheckPincode(e.target.value)}
                />
                <button
                  type="submit"
                  className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium hover:tw-bg-blue-700 tw-transition-colors"
                >
                  Check
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:tw-col-span-6 lg:tw-col-span-7 tw-space-y-6">
            <div>
              <p className="tw-text-primary tw-font-medium tw-text-sm tw-uppercase tw-tracking-wide tw-mb-1">{product.category.name}</p>
              <h1 className="tw-text-3xl lg:tw-text-4xl tw-font-bold tw-text-gray-900 tw-leading-tight">{product.name}</h1>
              {product.freshnessNotes && (
                <p className="tw-text-green-600 tw-text-sm tw-mt-2 tw-flex tw-items-center tw-gap-1">
                  <span className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-green-500"></span>
                  {product.freshnessNotes}
                </p>
              )}
            </div>

            <div className="tw-py-4 tw-border-y tw-border-gray-100">
              <div className="tw-flex tw-items-baseline tw-gap-3">
                <span className="tw-text-3xl tw-font-bold tw-text-gray-900">₹{finalPrice}</span>
                {discount > 0 && (
                  <>
                    <span className="tw-text-lg tw-text-gray-400 tw-line-through">₹{finalPrice + 50}</span>
                    <span className="tw-bg-red-100 tw-text-red-700 tw-px-2 tw-py-0.5 tw-rounded tw-text-xs tw-font-bold">20% OFF</span>
                  </>
                )}
              </div>
              <p className="tw-text-gray-500 tw-text-sm tw-mt-1">Inclusive of all taxes</p>
            </div>

            {/* Weights */}
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">Select Pack Weight</label>
              <div className="tw-flex tw-flex-wrap tw-gap-3">
                {product.weights.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedWeight(opt)}
                    className={`tw-px-4 tw-py-2 tw-rounded-lg tw-border tw-text-sm tw-font-medium tw-transition-all ${selectedWeight.id === opt.id
                      ? 'tw-bg-primary tw-text-white tw-border-primary'
                      : 'tw-bg-white tw-text-gray-700 tw-border-gray-200 hover:tw-border-primary/50'
                      }`}
                  >
                    {opt.weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Time */}
            <div className="tw-bg-orange-50 tw-p-3 tw-rounded-lg tw-border tw-border-orange-100 tw-inline-block">
              <p className="tw-text-xs tw-text-orange-800 tw-font-medium">
                Delivery Timings: <span className="tw-font-bold">9:00 AM - 6:00 PM</span>, Today
              </p>
            </div>

            {/* Add to Cart */}
            <div className="tw-flex tw-gap-4 tw-pt-4">
              <div className="tw-flex-1">
                <AddToCartButton
                  product={{
                    ...product,
                    slug: product.category.slug,
                    weights: [selectedWeight]
                  }}
                />
              </div>
              <button className="tw-p-3 tw-border tw-border-gray-200 tw-rounded-xl tw-text-gray-500 hover:tw-bg-gray-50 tw-transition-colors">
                <Share2 size={24} />
              </button>
            </div>

            {/* Description */}
            <div className="tw-mt-8 tw-bg-white tw-border tw-border-gray-100 tw-rounded-xl tw-p-6">
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-3">Product Description</h3>
              <p className="tw-text-gray-600 tw-leading-relaxed tw-text-sm">
                {product.description || "No description available for this delicious product. Our meat is sourced from the best farms and delivered fresh to your doorstep."}
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Section - Could be a separate component but keeping inline for now */}
        {/* Placeholder for now to cleaner layout */}
      </div>
    </div>
  );
}
