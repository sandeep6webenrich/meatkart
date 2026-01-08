import React from 'react';

export const metadata = {
  title: 'Shipping Policy | United Healthcare',
  description: 'Shipping and Delivery Policy for United Healthcare website.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Shipping & Delivery Policy</h1>
        <p className="text-stone-500 mb-8">Last Updated: January 2026</p>

        <div className="prose prose-stone max-w-none text-stone-700 space-y-6">
          <p>
            This Shipping & Delivery Policy is part of our Terms and Conditions ("Terms") and should be therefore read alongside our main Terms: https://unitedhealthcare.com/terms-conditions.
          </p>
          <p>
            Please carefully review our Shipping & Delivery Policy when purchasing our products. This policy will apply to any order you place with us.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">1. What are my shipping & delivery options?</h3>
          <p>
            <strong>Standard Shipping:</strong> We offer Standard Shipping on all orders. Shipping is free for orders over ₹499. For orders under ₹499, a flat shipping fee of ₹50 applies.
          </p>
          <p>
            <strong>Delivery Time:</strong> Standard shipping typically takes 3-7 business days, depending on your location.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">2. Do you deliver internationally?</h3>
          <p>
            We do not offer international shipping at this time. We only ship within India.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">3. What happens if my order is delayed?</h3>
          <p>
            If delivery is delayed for any reason, we will let you know as soon as possible and advise you of a revised estimated date for delivery.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">4. Questions about returns?</h3>
          <p>
            If you have questions about returns, please review our Return Policy: https://unitedhealthcare.com/refund-policy.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">5. How can you contact us about this policy?</h3>
          <p>
            If you have any further questions or comments, you may contact us by:
          </p>
          <ul className="list-disc pl-6">
            <li>Email: support@unitedhealthcare.com</li>
            <li>Phone: +91 98765 43210</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
