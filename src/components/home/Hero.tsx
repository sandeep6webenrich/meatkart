import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Pattern/Image Placeholder */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-transparent z-10"></div>
        <img 
          src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20green%20herbal%20leaves%20and%20natural%20wellness%20ingredients%20on%20a%20dark%20background%2C%20cinematic%20lighting%2C%20high%20quality%2C%20minimalist&image_size=landscape_16_9" 
          alt="Herbal Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-20">
        <div className="max-w-2xl">
          <span className="inline-block bg-green-600/20 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-600/30">
            100% Natural & Authentic
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Rediscover Nature's <br />
            <span className="text-green-500">Healing Power</span>
          </h1>
          <p className="text-xl text-stone-300 mb-8 leading-relaxed">
            Premium herbal supplements crafted with traditional wisdom and modern science. 
            Experience holistic wellness with our purity-tested range.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:-translate-y-0.5"
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center bg-transparent border border-stone-600 hover:border-stone-400 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
