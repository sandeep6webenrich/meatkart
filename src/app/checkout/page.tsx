import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata = {
  title: 'Checkout | United Healthcare',
  description: 'Secure checkout for your order.',
};

export default function CheckoutPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-stone-900 mb-8 text-center">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
