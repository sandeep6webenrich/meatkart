'use client';

import { useState } from 'react';
import { Truck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ShipOrderButtonProps {
  orderId: string;
  isShipped: boolean;
}

export default function ShipOrderButton({ orderId, isShipped }: ShipOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleShip = async () => {
    if (!confirm('Are you sure you want to create a shipment with NimbusPost?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Shipment created successfully!');
        router.refresh();
      } else {
        alert(data.message || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Shipping error:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isShipped) return null;

  return (
    <button
      onClick={handleShip}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
      Ship via NimbusPost
    </button>
  );
}
