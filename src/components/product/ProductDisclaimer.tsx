import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ProductDisclaimer() {
  return (
    <div className="mt-8 rounded-lg bg-amber-50 p-4 border border-amber-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="font-semibold text-amber-900 text-sm">FSSAI & Health Disclaimer</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            This product is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease. 
            The statements made regarding these products have not been evaluated by the Food Safety and Standards Authority of India (FSSAI). 
            Please consult your healthcare professional before use, especially if you are pregnant, nursing, or taking any medication.
          </p>
          <p className="text-xs text-amber-700">
            *Results may vary from person to person.
          </p>
        </div>
      </div>
    </div>
  );
}
