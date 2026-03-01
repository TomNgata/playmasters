'use client';

import Spline from '@splinetool/react-spline/next';
import { useState } from 'react';

export default function BowlingHero() {
  const [loaded, setLoaded] = useState(false);

  // Skip Spline on mobile / low-end devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isLowEnd = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 2;

  return (
    <div className="w-full h-[60vh] min-h-[500px] relative bg-navy-void border-b border-navy-deep overflow-hidden">

      {/* Fallback background — hidden once Spline loads */}
      <div
        className="absolute inset-0 bg-navy-dark z-0 transition-opacity duration-500 ease-in-out"
        style={{ opacity: loaded ? 0 : 1 }}
      />

      {/* The Spline Scene placeholder — to be filled by the user */}
      {!isMobile && !isLowEnd && (
        <div className="absolute inset-0 z-0">
          <Spline
            // ⚠️  PLACEHOLDER: Replace this URL with your Spline scene URL
            // Export from spline.design → Share → Copy Embed URL
            scene="https://prod.spline.design/REPLACE_WITH_YOUR_SCENE/scene.splinecode"
            onLoad={() => setLoaded(true)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 bg-gradient-to-t from-navy-void via-transparent to-transparent z-10">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="font-wordmark text-[clamp(48px,10vw,120px)] leading-[0.85] text-white tracking-wide uppercase">
            Play<span className="text-strike" style={{ WebkitTextStroke: '2px #E82030', paintOrder: 'stroke fill' }}>masters</span><br />
            <span className="text-white">Kenya</span>
          </h1>
          <p className="font-title italic text-playgray-mid mt-4 max-w-md text-lg">
            Nairobi's premier bowling team. Strike like Playmasters.
          </p>
        </div>
      </div>
    </div>
  );
}
