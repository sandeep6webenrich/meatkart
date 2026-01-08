import React from 'react';

export const metadata = {
  title: 'Refund Policy | United Healthcare',
  description: 'Refund and Cancellation Policy for United Healthcare website.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Refund & Cancellation Policy</h1>
        <p className="text-stone-500 mb-8">Last Updated: January 2026</p>

        <div className="prose prose-stone max-w-none text-stone-700 space-y-6">
          <p>
            Thank you for your purchase. We hope you are happy with your purchase. However, if you are not completely satisfied with your purchase for any valid reason, you may return it to us for a full refund or an exchange. Please see below for more information on our return policy.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">1. Returns</h3>
          <p>
            All returns must be postmarked within seven (7) days of the purchase date. All returned items must be in new and unused condition, with all original tags and labels attached.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">2. Return Process</h3>
          <p>
            To return an item, please email customer service at support@unitedhealthcare.com to obtain a Return Merchandise Authorization (RMA) number. After receiving a RMA number, place the item securely in its original packaging and mail your return to the address provided by our support team.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">3. Refunds</h3>
          <p>
            After receiving your return and inspecting the condition of your item, we will process your return or exchange. Please allow at least seven (7) days from the receipt of your item to process your return. Refunds may take 1-2 billing cycles to appear on your credit card statement, depending on your credit card company. We will notify you by email when your return has been processed.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">4. Exceptions</h3>
          <p>
            The following items cannot be returned or exchanged:
          </p>
          <ul className="list-disc pl-6">
            <li>Perishable goods</li>
            <li>Intimate or sanitary goods</li>
            <li>Hazardous materials</li>
          </ul>
          <p>
            For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">5. Cancellations</h3>
          <p>
            You can cancel your order before it has been shipped. If the order has already been shipped, you will need to follow the return process described above.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">6. Questions</h3>
          <p>
            If you have any questions concerning our return policy, please contact us at:
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
