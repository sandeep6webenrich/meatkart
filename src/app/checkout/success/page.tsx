import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export const metadata = {
  title: 'Order Confirmed | United Healthcare',
  description: 'Your order has been successfully placed.',
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = await searchParams;

  return (
    <div className="bg-stone-50 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-stone-100 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Order Confirmed!</h1>
        <p className="text-stone-500 mb-6">
          Thank you for your purchase. We have received your order and will begin processing it right away.
        </p>

        {orderNumber && (
          <div className="bg-stone-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-stone-500 mb-1">Order Number</p>
            <p className="text-lg font-mono font-bold text-stone-900">{orderNumber}</p>
          </div>
        )}

        <Link 
          href="/shop" 
          className="w-full bg-stone-900 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
