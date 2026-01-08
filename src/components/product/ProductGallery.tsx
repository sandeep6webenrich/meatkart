'use client';

import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string | null;
  alt?: string | null;
}

interface ProductGalleryProps {
  media: MediaItem[];
}

export default function ProductGallery({ media }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMedia = media[selectedIndex];

  if (media.length === 0) {
    return (
      <div className="bg-stone-100 aspect-square relative flex items-center justify-center rounded-xl overflow-hidden">
        <span className="text-stone-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="bg-stone-100 aspect-square relative rounded-xl overflow-hidden border border-stone-200">
        {selectedMedia.type === 'video' ? (
          <video
            src={selectedMedia.url}
            controls
            className="w-full h-full object-contain"
            poster={selectedMedia.thumbnailUrl || undefined}
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={selectedMedia.url}
              alt={selectedMedia.alt || 'Product image'}
              fill
              className="object-contain mix-blend-multiply p-4"
              priority
            />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-green-600 ring-2 ring-green-100'
                  : 'border-transparent hover:border-stone-300'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-stone-900 flex items-center justify-center relative">
                   {/* If we have a thumbnail for the video, show it */}
                   {item.thumbnailUrl && (
                      <img 
                        src={item.thumbnailUrl} 
                        alt="Video thumbnail" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60" 
                      />
                   )}
                  <PlayCircle className="w-8 h-8 text-white z-10" />
                </div>
              ) : (
                <div className="relative w-full h-full bg-stone-100">
                  <Image
                    src={item.url}
                    alt={item.alt || 'Thumbnail'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
