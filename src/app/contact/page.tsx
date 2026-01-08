import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | United Healthcare',
  description: 'Get in touch with United Healthcare. We are here to help you with your queries regarding our herbal products.',
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-stone-900 mb-4 text-center">Contact Us</h1>
        <p className="text-stone-600 text-center mb-12 max-w-2xl mx-auto">
          Have questions about our products or your order? We're here to help. Reach out to us through any of the channels below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-stone-50 p-8 rounded-2xl space-y-6">
              <h2 className="text-xl font-bold text-stone-900">Get in Touch</h2>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Phone</h3>
                  <p className="text-stone-600">+91 98765 43210</p>
                  <p className="text-sm text-stone-500">Mon-Sat, 10:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Email</h3>
                  <p className="text-stone-600">support@unitedhealthcare.com</p>
                  <p className="text-sm text-stone-500">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Office Address</h3>
                  <p className="text-stone-600">
                    United Healthcare Pvt. Ltd.<br />
                    123, Wellness Tower, Sector 62,<br />
                    Noida, Uttar Pradesh - 201301
                  </p>
                </div>
              </div>
            </div>

            {/* Legal / Compliance Info */}
            <div className="border border-stone-200 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Compliance Information</h2>
              <div className="space-y-3 text-sm text-stone-600">
                <p>
                  <span className="font-semibold text-stone-800">GSTIN:</span> 09AAACU1234A1Z5
                </p>
                <p>
                  <span className="font-semibold text-stone-800">FSSAI License No:</span> 10012051000000
                </p>
                <p>
                  <span className="font-semibold text-stone-800">Corporate Identity Number (CIN):</span> U12345UP2023PTC123456
                </p>
                <p>
                  <span className="font-semibold text-stone-800">Nodal Officer:</span> Sandeep Kumar
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                  <input type="text" className="w-full rounded-lg border-stone-200 focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                  <input type="text" className="w-full rounded-lg border-stone-200 focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                <input type="email" className="w-full rounded-lg border-stone-200 focus:ring-green-500 focus:border-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Subject</label>
                <input type="text" className="w-full rounded-lg border-stone-200 focus:ring-green-500 focus:border-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                <textarea rows={4} className="w-full rounded-lg border-stone-200 focus:ring-green-500 focus:border-green-500"></textarea>
              </div>

              <button type="submit" className="w-full bg-stone-900 text-white font-bold py-3 rounded-lg hover:bg-stone-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
