import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | United Healthcare',
  description: 'Terms and Conditions for United Healthcare website.',
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Terms & Conditions</h1>
        <p className="text-stone-500 mb-8">Last Updated: January 2026</p>

        <div className="prose prose-stone max-w-none text-stone-700 space-y-6">
          <p>
            Welcome to United Healthcare. By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our website.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">1. Products and Services</h3>
          <p>
            All products listed on the website, their descriptions, and their prices are subject to change. We reserve the right to modify, suspend, or discontinue the sale of any product at any time without notice.
          </p>
          <p>
            <strong>Disclaimer:</strong> The products sold on this website are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary from person to person.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">2. Ordering and Payment</h3>
          <p>
            When you place an order, you agree that all details you provide to us are true and accurate, that you are an authorized user of the credit or debit card used to place your order, and that there are sufficient funds to cover the cost of the goods.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">3. Shipping and Delivery</h3>
          <p>
            We will make every effort to deliver your order within the estimated timeframe. However, delays may occur due to unforeseen circumstances. We are not liable for any loss or damage arising from late delivery.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">4. Returns and Refunds</h3>
          <p>
            Please refer to our Refund Policy for information on returns and refunds. We reserve the right to refuse a return if the product does not meet our return criteria.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">5. Intellectual Property</h3>
          <p>
            All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of United Healthcare or its content suppliers and protected by international copyright laws.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">6. Limitation of Liability</h3>
          <p>
            In no event shall United Healthcare, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">7. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
}
