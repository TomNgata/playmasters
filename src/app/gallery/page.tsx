import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Gallery | PlayMasters Kenya',
  description: 'Pure performance. Action shots and behind-the-scenes moments from the PlayMasters squad on the lanes.',
};

// Assuming all converted 20 action shots from public/images/gallery/
const actionImages = [
  'IMG_1176.jpg', 'IMG_1232.jpg', 'IMG_1235.jpg', 'IMG_1236.jpg', 'IMG_1242.jpg', 
  'IMG_1290.jpg', 'IMG_1337.jpg', 'IMG_1365.jpg', 'IMG_1384.jpg', 'IMG_1398.jpg', 
  'IMG_1400.jpg', 'IMG_1405.jpg', 'IMG_1411.jpg', 'IMG_2397.jpg', 'IMG_2400.jpg', 
  'IMG_2884.jpg', 'IMG_2892.jpg', 'IMG_2895.jpg', 'IMG_2898.jpg', 'IMG_2901.jpg'
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">
      
      {/* ─── Hero ─── */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="font-wordmark text-[18vw] text-white/[0.025] uppercase whitespace-nowrap">ACTION</span>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-ui text-strike text-sm tracking-[6px] uppercase font-bold">Behind The Lanes</span>
          <h1 className="font-wordmark text-[clamp(40px,8vw,96px)] uppercase leading-none">
            The <span className="text-strike">Gallery</span>
          </h1>
          <p className="font-sans text-gray-mid text-lg md:text-xl max-w-2xl leading-relaxed">
            Pure performance. Action shots and behind-the-scenes moments from the PlayMasters squad on the lanes.
          </p>
        </div>
      </section>

      {/* ─── Masonry Grid ─── */}
      <section className="block w-full max-w-[1600px] mx-auto px-4 md:px-6 py-20 relative">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {actionImages.map((img, i) => (
            <div 
              key={i} 
              className="group relative break-inside-avoid overflow-hidden rounded-xl bg-navy border border-white/5 shadow-2xl glass-glow"
            >
              <div className="aspect-[3/4] relative w-full h-full">
                <Image 
                  src={`/images/gallery/${img}`} 
                  alt={`Playmasters Action ${i + 1}`} 
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute inset-0 border-2 border-strike/0 group-hover:border-strike/20 transition-all duration-500 rounded-xl pointer-events-none" />
            </div>
          ))}
        </div>
      </section>
      
    </main>
  );
}
