import CartPageContent from '@/components/cart/CartPageContent';

export const metadata = {
  title: 'Shopping Cart | United Healthcare',
  description: 'Review your selected herbal products and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Your Cart</h1>
        <CartPageContent />
      </div>
    </div>
  );
}
