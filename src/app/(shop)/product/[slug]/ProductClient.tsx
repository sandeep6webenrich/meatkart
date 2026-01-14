'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useLocationStore } from '@/store/location-store'
import { toast } from 'sonner';
import { MapPin, Heart, Share2, ChevronDown, Utensils } from 'lucide-react';
import { addItemToPlatter, getPlatters, createPlatter } from '@/app/actions/platter';
import AddToCartButton from '@/components/product/AddToCartButton';
import { createClient } from '@/lib/supabase/client';
import deliverySlots from '@/data/delivery-slots.json';

type ProductWeight = {
  id: string;
  weight: string;
  price: number;
}

type Product = {
  id: string;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  description: string | null;
  freshnessNotes: string | null;
  imageUrl: string;
  weights: ProductWeight[];
}

export default function ProductClient({ product }: { product: Product }) {
  const { city } = useLocationStore();
  const [checkPincode, setCheckPincode] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0]);

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

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(0, prev - 1));

  const handleWeightSelect = (weight: ProductWeight) => {
    setSelectedWeight(weight);
    setIsDropdownOpen(false);
  };

  const handleAddToPlatter = async () => {
    // Check if user is logged in (optional, but good for UX before calling server action)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Please login to add to platter');
      return;
    }

    try {
      // Get platters (server action uses session)
      let platters = await getPlatters();
      let targetPlatterId;

      if (platters.length === 0) {
        const result = await createPlatter('My Weekly Platter');
        if (result.success && result.platter) {
          targetPlatterId = result.platter.id;
        } else {
          toast.error('Failed to create platter');
          return;
        }
      } else {
        targetPlatterId = platters[0].id; // For MVP, add to first platter if none selected
      }

      const res = await addItemToPlatter(
        targetPlatterId,
        product.id,
        selectedWeight.id,
        null, // cutType for now is null
        quantity || 1
      );

      if (res.success) {
        toast.success('Added to your platter!');
      } else {
        toast.error('Failed to add to platter');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="tw-bg-white tw-min-h-screen">
      {/* Breadcrumbs - Gray background */}
      <div className="tw-bg-gray-200 tw-border-b tw-border-gray-300">
        <div className="tw-max-w-[1180px] tw-mx-auto tw-px-4 tw-py-3">
          <nav className="tw-text-base tw-text-gray-600">
            <ol className="tw-list-none tw-p-0 tw-inline-flex tw-items-center">
              <li className="tw-flex tw-items-center">
                <Link href="/" className="hover:tw-text-teal tw-text-gray-700">Home</Link>
                <span className="tw-mx-3 tw-text-gray-400">/</span>
              </li>
              <li className="tw-flex tw-items-center">
                <Link href={`/category/${product.category.slug}`} className="hover:tw-text-teal tw-text-gray-700">{product.category.name}</Link>
                <span className="tw-mx-3 tw-text-gray-400">/</span>
              </li>
              <li className="tw-text-gray-700">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="tw-max-w-[1180px] tw-mx-auto tw-px-4 tw-py-10">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-8 lg:tw-gap-12">

          {/* Left Column: Category Banner + Image + Check Availability */}
          <div className="lg:tw-col-span-5 tw-space-y-5">
            {/* Category Banner */}
            <div
              className="tw-py-3 tw-px-6 tw-rounded-sm"
              style={{ background: 'linear-gradient(135deg, #f5a623 0%, #f7b731 100%)' }}
            >
              <span className="tw-text-white tw-font-bold tw-text-xl tw-uppercase tracking-wide">
                {product.category.name}
              </span>
            </div>

            {/* Product Image */}
            <div className="tw-bg-white tw-border tw-border-gray-200 tw-relative tw-p-6">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="tw-w-full tw-h-auto tw-object-contain tw-min-h-[350px]"
              />
              {/* FREE SHIPPING Badge */}
              <div className="tw-absolute tw-bottom-6 tw-left-6">
                <img
                  src="/images/free-shipping.png"
                  alt="Free Shipping"
                  className="tw-w-24 tw-h-24 tw-object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
            </div>

            {/* Check Availability */}
            <div className="tw-flex tw-items-center tw-gap-3 tw-flex-wrap tw-py-2">
              <div className="tw-flex tw-items-center tw-gap-2">
                <MapPin className="tw-text-orange-cta" size={20} />
                <span className="tw-text-base tw-text-gray-700 tw-font-medium">Check Availability at :</span>
              </div>
              <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1 tw-min-w-[250px]">
                <input
                  type="text"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded tw-px-4 tw-py-3 tw-text-base tw-outline-none focus:tw-border-orange-cta"
                  placeholder="Enter pincode"
                  value={checkPincode}
                  onChange={(e) => setCheckPincode(e.target.value)}
                />
                <button
                  onClick={handleCheckAvailability}
                  className="tw-bg-orange-cta tw-text-white tw-px-6 tw-py-3 tw-rounded tw-text-base tw-font-bold tw-uppercase hover:tw-bg-orange-cta-hover tw-transition-colors"
                >
                  Check
                </button>
              </div>
            </div>
          </div>

          {/* Center Column: Product Details */}
          <div className="lg:tw-col-span-5 tw-space-y-5">
            {/* Product Name */}
            <h1 className="tw-text-3xl lg:tw-text-4xl tw-font-bold tw-text-teal">{product.name}</h1>

            {/* Dotted Separator */}
            <div className="tw-border-t tw-border-dashed tw-border-gray-300 tw-my-5"></div>

            {/* Pack Size Dropdown */}
            <div className="tw-flex tw-items-center tw-gap-6 tw-py-2">
              <span className="tw-text-gray-700 tw-font-medium tw-text-lg tw-min-w-[100px]">Pack Size</span>
              <span className="tw-text-gray-400 tw-text-lg">→</span>
              <div className="tw-relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="tw-flex tw-items-center tw-gap-3 tw-border tw-border-gray-300 tw-rounded tw-px-4 tw-py-2.5 tw-text-base tw-bg-white tw-min-w-[150px] tw-justify-between"
                >
                  <span>{selectedWeight.weight}</span>
                  <ChevronDown size={20} className="tw-text-gray-500" />
                </button>
                {isDropdownOpen && (
                  <div className="tw-absolute tw-z-10 tw-mt-1 tw-w-full tw-bg-white tw-border tw-border-gray-300 tw-rounded tw-shadow-lg">
                    {product.weights.map((weight) => (
                      <button
                        key={weight.id}
                        onClick={() => handleWeightSelect(weight)}
                        className={`tw-w-full tw-text-left tw-px-4 tw-py-3 tw-text-base hover:tw-bg-gray-100 ${selectedWeight.id === weight.id ? 'tw-bg-gray-50 tw-font-medium' : ''
                          }`}
                      >
                        {weight.weight}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="tw-flex tw-items-center tw-gap-6 tw-py-2">
              <span className="tw-text-gray-700 tw-font-medium tw-text-lg tw-min-w-[100px]">Price</span>
              <span className="tw-text-gray-400 tw-text-lg">→</span>
              <span className="tw-text-orange-cta tw-font-bold tw-text-2xl">₹ {selectedWeight.price}</span>
            </div>

            {/* Quantity */}
            <div className="tw-flex tw-items-center tw-gap-6 tw-py-2">
              <span className="tw-text-gray-700 tw-font-medium tw-text-lg tw-min-w-[100px]">Qty</span>
              <span className="tw-text-gray-400 tw-text-lg">→</span>
              <div className="tw-flex tw-items-center">
                <button
                  onClick={handleDecrement}
                  className="tw-w-10 tw-h-10 tw-border tw-border-gray-300 tw-bg-gray-100 tw-rounded-l tw-flex tw-items-center tw-justify-center tw-text-gray-600 tw-text-xl hover:tw-bg-gray-200"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="tw-w-16 tw-h-10 tw-border-t tw-border-b tw-border-gray-300 tw-text-center tw-text-lg"
                />
                <button
                  onClick={handleIncrement}
                  className="tw-w-10 tw-h-10 tw-border tw-border-gray-300 tw-bg-gray-100 tw-rounded-r tw-flex tw-items-center tw-justify-center tw-text-gray-600 tw-text-xl hover:tw-bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Choose Delivery Time Button */}
            <div className="tw-relative tw-w-full tw-max-w-lg">
              <button
                onClick={() => setIsSlotDropdownOpen(!isSlotDropdownOpen)}
                className="tw-w-full tw-bg-orange-cta tw-text-white tw-py-4 tw-px-8 tw-rounded tw-font-bold tw-text-lg tw-uppercase hover:tw-bg-orange-cta-hover tw-transition-colors tw-shadow-md tw-mt-4 tw-flex tw-items-center tw-justify-between"
              >
                <span>{selectedSlot.id === 'default' ? 'Choose Delivery Time' : selectedSlot.label}</span>
                <ChevronDown size={24} className={`tw-transition-transform ${isSlotDropdownOpen ? 'tw-rotate-180' : ''}`} />
              </button>
              {isSlotDropdownOpen && (
                <div className="tw-absolute tw-z-20 tw-mt-1 tw-w-full tw-bg-white tw-border tw-border-gray-300 tw-rounded tw-shadow-xl tw-overflow-hidden">
                  {deliverySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setIsSlotDropdownOpen(false);
                      }}
                      className={`tw-w-full tw-text-left tw-px-6 tw-py-4 tw-text-lg hover:tw-bg-orange-50 tw-transition-colors ${selectedSlot.id === slot.id ? 'tw-bg-orange-100 tw-font-bold tw-text-orange-cta' : 'tw-text-gray-700'
                        }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="tw-w-full tw-max-w-lg tw-pt-2">
              <AddToCartButton
                product={product}
                externalWeightId={selectedWeight.id}
              />
            </div>

            {/* Delivery Timings */}
            <p className="tw-text-base tw-text-gray-600">
              <span className="tw-font-medium">Selected Delivery:</span> {selectedSlot.label || '9.00am to 6.00pm, anyday'}
            </p>

            {/* Description Section */}
            <div className="tw-mt-8 tw-pt-6">
              <h2 className="tw-text-2xl tw-font-bold tw-text-teal tw-mb-4">{product.name} Description:</h2>
              <div className="tw-text-gray-600 tw-text-base tw-leading-relaxed tw-space-y-4">
                {product.description ? (
                  product.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      {product.name} is a premium cut of meat which is commonly used to make stew and is great
                      when barbecued, stuffed & in curries.
                    </p>
                    <p>
                      Lamb meat is high in protein, selenium, zinc and iron. The speciality of this meat is that it has all 8
                      amino acids and more than half of its fat content is healthy unsaturated fat. It also contains vitamin
                      B, and copper and manganese. This meat aids muscle generation and the production of red blood
                      cells, avoiding "anemia". It also helps boost the immune system and prevent age related
                      diseases.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Action Buttons */}
          <div className="lg:tw-col-span-2 tw-space-y-8 tw-pt-4">
            {/* Add to My Platter */}
            <div className="tw-flex tw-flex-col tw-items-center tw-text-center">
              <button
                onClick={handleAddToPlatter}
                className="tw-w-20 tw-h-20 tw-rounded-full tw-bg-orange-cta tw-flex tw-items-center tw-justify-center tw-shadow-lg hover:tw-bg-orange-cta-hover tw-transition-colors tw-mb-3"
              >
                <Utensils size={36} className="tw-text-white" />
              </button>
              <span className="tw-text-base tw-text-gray-600">Add to My Platter</span>
            </div>

            {/* Share with a Friend */}
            <div className="tw-flex tw-flex-col tw-items-center tw-text-center">
              <button className="tw-w-20 tw-h-20 tw-rounded-full tw-bg-orange-cta tw-flex tw-items-center tw-justify-center tw-shadow-lg hover:tw-bg-orange-cta-hover tw-transition-colors tw-mb-3">
                <Share2 size={36} className="tw-text-white" />
              </button>
              <span className="tw-text-base tw-text-gray-600">Share with a Friend</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
