'use client';

const sponsors = [
    { name: 'Cameras Africa', src: '/sponsors/cameras-africa.png' },
    { name: 'Dentex Industries', src: '/sponsors/dentex-industries.png' },
    { name: 'Emami Mentho Plus', src: '/sponsors/emami-mentho-plus.png' },
    { name: 'Europa Logo', src: '/sponsors/europalogo.png' },
    { name: 'GCS Velogic', src: '/sponsors/gcs-velogic.png' },
    { name: 'Ideal Ceramics', src: '/sponsors/ideal-ceramics.png' },
    { name: 'Mayfair Insurance', src: '/sponsors/mayfair-insurance.png' },
    { name: 'Mr. Berrys', src: '/sponsors/mr-berrys.png' },
    { name: 'Nextcraft', src: '/sponsors/nextcraft.png' },
    { name: 'Power Parts', src: '/sponsors/power-parts.png' },
    { name: 'RAA', src: '/sponsors/raa.png' },
    { name: 'Roto Tanks', src: '/sponsors/roto-tanks.png' },
    { name: 'Techno Roots', src: '/sponsors/techno-roots.png' },
    { name: 'Wow Safaris', src: '/sponsors/wow-safaris.png' },
];

export default function SponsorMarquee() {
    return (
        <section className="w-full bg-navy/30 py-16 border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center">
                <span className="font-ui text-strike uppercase tracking-[6px] text-[10px] font-black mb-2">Our Partners</span>
                <h3 className="font-wordmark text-3xl text-white uppercase tracking-tighter">Strategic Alliances</h3>
            </div>
            
            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee flex items-center whitespace-nowrap gap-16 py-4">
                    {/* First set of logos */}
                    {sponsors.map((sponsor, idx) => (
                        <div key={idx} className="flex-shrink-0 w-40 h-20 relative grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help" title={sponsor.name}>
                            <img 
                                src={sponsor.src} 
                                alt={sponsor.name} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {sponsors.map((sponsor, idx) => (
                        <div key={`dup-${idx}`} className="flex-shrink-0 w-40 h-20 relative grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help" title={sponsor.name}>
                            <img 
                                src={sponsor.src} 
                                alt={sponsor.name} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Tailwind Custom Animation Style (should be in globals.css or component) */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                    display: flex;
                    width: max-content;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
