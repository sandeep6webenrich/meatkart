import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | United Healthcare',
  description: 'Learn about United Healthcare, our mission to provide authentic herbal products, and our commitment to quality and wellness.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-stone-900 mb-8 text-center">About United Healthcare</h1>
        
        <div className="prose prose-stone mx-auto text-lg text-stone-700 space-y-6">
          <p>
            Welcome to <strong>United Healthcare</strong>, your trusted partner in holistic wellness and authentic herbal solutions. 
            Founded with a vision to bridge the gap between ancient Ayurvedic wisdom and modern lifestyle needs, we are dedicated to providing 
            premium quality herbal products that promote a healthier, more balanced life.
          </p>

          <h2 className="text-2xl font-bold text-stone-900 mt-8">Our Mission</h2>
          <p>
            Our mission is simple: to empower individuals to take charge of their health through nature's best remedies. 
            We believe in the power of purity, which is why all our products are sourced from the finest ingredients, 
            rigorously tested, and manufactured in FSSAI-compliant facilities.
          </p>

          <h2 className="text-2xl font-bold text-stone-900 mt-8">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authenticity:</strong> 100% natural ingredients with no harmful chemicals.</li>
            <li><strong>Quality Assurance:</strong> Manufactured in GMP-certified and FSSAI-licensed facilities.</li>
            <li><strong>Transparency:</strong> Clear labeling and honest communication about our products.</li>
            <li><strong>Customer First:</strong> Dedicated support and seamless shopping experience.</li>
          </ul>

          <h2 className="text-2xl font-bold text-stone-900 mt-8">Our Commitment</h2>
          <p>
            We are committed to sustainability and ethical practices. From sourcing raw materials to eco-friendly packaging, 
            every step is taken with care for the planet and our community. We strictly adhere to all guidelines set by the 
            Food Safety and Standards Authority of India (FSSAI) to ensure safety and efficacy.
          </p>

          <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 mt-8">
            <p className="italic text-stone-600 text-center">
              "Nature has provided us with everything we need for health and healing. Our job is simply to bring it to you in its purest form."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
