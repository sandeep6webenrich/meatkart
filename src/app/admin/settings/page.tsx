'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save, CreditCard, Truck, Mail, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

type SettingsData = {
  payment: {
    provider: string;
    publishableKey: string;
    secretKey: string;
    merchantId: string;
  };
  shipping: {
    provider: string;
    email: string;
    password: string;
    apiKey: string;
  };
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    fromAddress: string;
  };
  analytics: {
    googleAnalyticsId: string;
    facebookPixelId: string;
  };
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'payment' | 'shipping' | 'email' | 'analytics'>('payment');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset } = useForm<SettingsData>();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        reset(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SettingsData) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        throw new Error(result.message || 'Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
  }

  const tabs = [
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">System Settings</h1>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar Tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            
            {/* Payment Settings */}
            <div className={activeTab === 'payment' ? 'space-y-6' : 'hidden'}>
              <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Payment Configuration</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Payment Provider</label>
                  <select {...register('payment.provider')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5">
                    <option value="stripe">Stripe</option>
                    <option value="razorpay">Razorpay</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Publishable Key</label>
                  <input type="text" {...register('payment.publishableKey')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Secret Key</label>
                  <input type="password" {...register('payment.secretKey')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" />
                </div>
              </div>
            </div>

            {/* Shipping Settings */}
            <div className={activeTab === 'shipping' ? 'space-y-6' : 'hidden'}>
              <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Shipping Configuration</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Shipping Provider</label>
                  <select {...register('shipping.provider')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5">
                    <option value="nimbuspost">NimbusPost</option>
                    <option value="shiprocket">Shiprocket</option>
                    <option value="delhivery">Delhivery</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">API Email</label>
                  <input type="email" {...register('shipping.email')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">API Password</label>
                  <input type="password" {...register('shipping.password')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" />
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div className={activeTab === 'email' ? 'space-y-6' : 'hidden'}>
              <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Email Configuration (SMTP)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">SMTP Host</label>
                  <input type="text" {...register('email.host')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">SMTP Port</label>
                  <input type="number" {...register('email.port')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Username</label>
                  <input type="text" {...register('email.user')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Password</label>
                  <input type="password" {...register('email.password')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-stone-700">From Address</label>
                  <input type="email" {...register('email.fromAddress')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" placeholder="noreply@example.com" />
                </div>
              </div>
            </div>

            {/* Analytics Settings */}
            <div className={activeTab === 'analytics' ? 'space-y-6' : 'hidden'}>
              <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">Analytics Configuration</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Google Analytics ID</label>
                  <input type="text" {...register('analytics.googleAnalyticsId')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" placeholder="G-XXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Facebook Pixel ID</label>
                  <input type="text" {...register('analytics.facebookPixelId')} className="w-full rounded-lg border border-stone-200 px-4 py-2.5" placeholder="XXXXXXXXXXXXXXX" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
