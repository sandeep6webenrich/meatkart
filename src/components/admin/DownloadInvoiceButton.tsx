'use client';

import { Download } from 'lucide-react';
import { generateInvoice } from '@/lib/invoice';

interface DownloadInvoiceButtonProps {
  order: any; 
}

export default function DownloadInvoiceButton({ order }: DownloadInvoiceButtonProps) {
  return (
    <button
      onClick={() => generateInvoice(order)}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium shadow-sm"
    >
      <Download className="h-4 w-4" />
      Invoice
    </button>
  );
}
