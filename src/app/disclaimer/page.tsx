import React from 'react';

export const metadata = {
  title: 'Disclaimer | United Healthcare',
  description: 'Legal Disclaimer for United Healthcare website.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Disclaimer</h1>
        <p className="text-stone-500 mb-8">Last Updated: January 2026</p>

        <div className="prose prose-stone max-w-none text-stone-700 space-y-6">
          <h3 className="text-xl font-bold text-stone-900 mt-6">1. Website Disclaimer</h3>
          <p>
            The information provided by United Healthcare ("we," "us," or "our") on this website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">2. Professional Disclaimer</h3>
          <p>
            The Site cannot and does not contain medical/health advice. The medical/health information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of medical/health advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">3. Product Disclaimer</h3>
          <p>
            The products sold on this website are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. The statements made regarding these products have not been evaluated by the Food Safety and Standards Authority of India (FSSAI). Results from the use of these products may vary from person to person.
          </p>

          <h3 className="text-xl font-bold text-stone-900 mt-6">4. Testimonials Disclaimer</h3>
          <p>
            The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences. YOUR INDIVIDUAL RESULTS MAY VARY.
          </p>
        </div>
      </div>
    </div>
  );
}
