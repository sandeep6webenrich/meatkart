'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SyncTrackingButton({ orderId }: { orderId: string }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/track`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.message || 'Sync failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className="p-1 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
      title="Sync Tracking Status"
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
    </button>
  );
}
