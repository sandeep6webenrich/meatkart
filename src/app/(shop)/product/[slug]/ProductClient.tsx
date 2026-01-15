'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useLocationStore } from '@/store/location-store'
import { toast } from 'sonner';
import { addItemToPlatter, getPlatters, createPlatter } from '@/app/actions/platter';
import AddToCartButton from '@/components/product/AddToCartButton';
import { createClient } from '@/lib/supabase/client';
import deliverySlots from '@/data/delivery-slots.json';

type ProductWeight = {
  id: string;
  weight: string;
  price: number;
  discountPrice?: number | null;
}

type Product = {
  id: string;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  description: string | null;
  freshnessNotes: string | null;
  freshnessDate: Date | string | null;
  cutTypes: string | null;
  imageUrl: string;
  weights: ProductWeight[];
}

export default function ProductClient({ product }: { product: Product }) {
  const { city } = useLocationStore();
  const [checkPincode, setCheckPincode] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCutDropdownOpen, setIsCutDropdownOpen] = useState(false);
  const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(deliverySlots[0]);

  const cutOptions = product.cutTypes ? product.cutTypes.split(',').map(s => s.trim()) : [];
  const [selectedCut, setSelectedCut] = useState(cutOptions.length > 0 ? cutOptions[0] : '');

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
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li><Link href={`/category/${product.category.slug}`}>{product.category.name}</Link></li>
            <li className="active">{product.name}</li>
          </ol>
        </div>
      </div>

      <section className="mutton-section">
        <div className="container">
          <div className="col-md-3 mutton-list no-gutter">
            <p>{product.category.name}</p>
          </div>
          <div className="col-md-8 no-gutter strip">
          </div>
        </div>

        <div className="container">
          <div className="col-md-12 mutton-content">
            <div className="col-md-5">
              <div className="mutton-img col-md-12">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="shipping-img col-md-4">
                <img src="/images/free-shipping.png" alt="free shipping" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <div className="col-md-8 no-gutter check-availability">
                <img src="/images/check-img.png" alt="check-img" />
                <div className="form-inline pull-right">
                  <div className="form-group">
                    <label htmlFor="pincode">Check Availability at :</label>
                    <input
                      type="text"
                      className="form-control form-control-width"
                      id="pincode"
                      value={checkPincode}
                      onChange={(e) => setCheckPincode(e.target.value)}
                    />
                  </div>
                </div>
                <button type="button" className="btn btn-default submit-mail pull-right check-button" onClick={handleCheckAvailability}>Check</button>
              </div>
            </div>

            <div className="col-md-4 mutton-curry-cut">
              <div className="details">
                <h2>{product.name}</h2>

                {/* Pack Size */}
                <div className="col-md-10 mutton-curry-content">
                  <p>Pack Size</p>
                  <img src="/images/arrow-invoice.png" alt="arrow" />
                  <div className={`dropdown mutton-curry-content-drop-down ${isDropdownOpen ? 'open' : ''}`}>
                    <button
                      id="dLabel"
                      type="button"
                      className="dropdown-toggle"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-haspopup="true"
                      aria-expanded={isDropdownOpen}
                      style={{ background: 'none', border: 'none', fontWeight: 'bold' }}
                    >
                      {selectedWeight.weight} <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dLabel">
                      {product.weights.map((w) => (
                        <li key={w.id}><a href="#" onClick={(e) => { e.preventDefault(); handleWeightSelect(w); }}>{w.weight}</a></li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cut Type Selection */}
                {cutOptions.length > 0 && (
                  <div className="col-md-10 mutton-curry-content">
                    <p>Cut Type</p>
                    <img src="/images/arrow-invoice.png" alt="arrow" />
                    <div className={`dropdown mutton-curry-content-drop-down ${isCutDropdownOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="dropdown-toggle"
                        onClick={() => setIsCutDropdownOpen(!isCutDropdownOpen)}
                        style={{ background: 'none', border: 'none', fontWeight: 'bold' }}
                      >
                        {selectedCut} <span className="caret"></span>
                      </button>
                      <ul className="dropdown-menu">
                        {cutOptions.map((opt, idx) => (
                          <li key={idx}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCut(opt); setIsCutDropdownOpen(false); }}>
                              {opt}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="col-md-10 mutton-curry-content">
                  <p>Price</p>
                  <img src="/images/arrow-invoice.png" alt="arrow" />
                  {selectedWeight.discountPrice ? (
                    <div style={{ display: 'inline-block' }}>
                      <em style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px', marginRight: '5px' }}>
                        &#8377; {selectedWeight.price}
                      </em>
                      <em style={{ color: '#e74c3c' }}>
                        &#8377; {selectedWeight.discountPrice}
                      </em>
                    </div>
                  ) : (
                    <em> &#8377; {selectedWeight.price}</em>
                  )}
                </div>

                {/* Freshness Information */}
                {(product.freshnessNotes || product.freshnessDate) && (
                  <div className="col-md-10 mutton-curry-content">
                    <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>Freshness:</p>
                    <div style={{ marginLeft: '10px' }}>
                      {product.freshnessNotes && <span style={{ fontSize: '13px', color: '#666', display: 'block' }}>{product.freshnessNotes}</span>}
                      {product.freshnessDate && (
                        <span style={{ fontSize: '11px', color: '#999' }}>
                          Last Stocked: {new Date(product.freshnessDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Qty */}
                <div className="col-md-10 mutton-curry-content qty">
                  <p>Qty</p>
                  <img src="/images/arrow-invoice.png" alt="arrow" />
                  <a href="#" onClick={(e) => { e.preventDefault(); handleDecrement(); }}><img src="/images/minus.png" alt="minus" /></a>
                  <input
                    type="text"
                    className="form-control form-control-width form-line"
                    value={quantity}
                    readOnly
                    style={{ textAlign: 'center' }}
                  />
                  <a href="#" onClick={(e) => { e.preventDefault(); handleIncrement(); }}><img src="/images/plus.png" alt="plus" /></a>
                </div>

                {/* Delivery Time */}
                <div className="col-md-10 invoices-list Choose-Delivery-Time no-gutter">
                  <p onClick={() => setIsSlotDropdownOpen(!isSlotDropdownOpen)} style={{ cursor: 'pointer' }}>
                    {selectedSlot.id === 'default' ? 'Choose Delivery Time' : selectedSlot.label}
                  </p>
                  <div className={`dropdown ${isSlotDropdownOpen ? 'open' : ''}`}>
                    {isSlotDropdownOpen && (
                      <ul className="dropdown-menu" style={{ display: 'block', position: 'relative', width: '100%', marginBottom: '10px' }}>
                        {deliverySlots.map((slot) => (
                          <li key={slot.id}><a href="#" onClick={(e) => { e.preventDefault(); setSelectedSlot(slot); setIsSlotDropdownOpen(false); }}>{slot.label}</a></li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span>Delivery Timings: {selectedSlot.label || '9.00am to 6.00pm, anyday'}</span>
                </div>

                {/* Add To Cart Button Container */}
                <div className="col-md-10 no-gutter" style={{ marginTop: '20px' }}>
                  <AddToCartButton product={product} externalWeightId={selectedWeight.id} cutType={selectedCut} />
                </div>

              </div>
            </div>

            <div className="col-md-2 share text-center">
              <div className="share-images">
                <a href="#" onClick={(e) => { e.preventDefault(); handleAddToPlatter(); }}>
                  <img src="/images/my-platter.png" alt="my-platter" />
                </a>
                <p>Add to My Platter</p>
              </div>
              <div className="share-images">
                <a href="#">
                  <img src="/images/share-icon.png" alt="share-icon" />
                </a>
                <p>Share with a Friend</p>
              </div>
            </div>

            <div className="col-md-7 curry-discription">
              <div className="details">
                <h2>{product.name} Description:</h2>
              </div>
              <div className="description-text">
                {product.description ? (
                  product.description.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>No description available.</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Certificate Section */}
        <div className="container">
          <div className="certificate-shipping border-top">
            <div className="col-md-6 certificate-content">
              <div className="certificate">
                <img src="/images/guarentee.png" alt="image" />
                <ul>
                  <li><span></span> Hand-cut & Trimmed</li>
                  <li><span></span> Products are Tested for Purity</li>
                  <li><span></span> 100% Guaranteed Fresh</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="transport">
                <img src="/images/transport.png" alt="image" />
                <ul>
                  <li><span></span> Free Shipping on orders above &#8377;400</li>
                  <li><span></span> Choose Your Own Delivery Time</li>
                  <li><span></span> Cash on Delivery Available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
