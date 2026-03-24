'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { name: 'Player Hub', href: '/dashboard/player' },
        { name: 'Competition Analysis', href: '/dashboard/competition' },
        { name: 'Rivalry Engine', href: '/dashboard/comparison' },
        { name: 'Log Score', href: '/dashboard/player/log-game' }
    ];

    return (
        <>
            <nav className="w-full border-b border-white/5 bg-navy-dark/95 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 md:px-0">
                    {/* Logo Section */}
                    <Link href="/" onClick={closeMenu} className="px-4 md:px-8 flex items-center gap-4 border-r border-white/5 h-full group hover:bg-white/[0.02] transition-colors">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                            <img
                                src="/logo-sm.png"
                                alt="Playmasters Logo"
                                className="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_8px_#E82030] transition-all"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-wordmark text-lg md:text-xl text-white uppercase tracking-wider">
                                Play<span className="text-strike">Masters</span>
                            </span>
                            <span className="font-ui text-[7px] md:text-[8px] text-gray-mid tracking-[2px] md:tracking-[3px] uppercase mt-1">Kenya Unit</span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex flex-1 h-full items-center justify-center font-ui text-lg tracking-[4px] uppercase text-gray-mid">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                className="px-8 hover:text-white transition-colors border-r border-white/5 h-full flex items-center hover:bg-white/[0.02]"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="px-8 flex items-center gap-3 h-full">
                            <span className="w-2 h-2 rounded-full bg-ball-pink animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_#D42080]" />
                            <span className="text-[10px] font-ui font-black uppercase tracking-[3px] text-ball-pink">Live</span>
                        </div>
                    </div>

                    {/* WhatsApp Liaison */}
                    <Link 
                        href="https://wa.me/254700000000" // Placeholder, should be updated with real number
                        target="_blank"
                        className="flex items-center gap-2 px-6 h-full border-l border-white/5 hover:bg-white/[0.02] transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.554 4.197 1.606 6.023L0 24l6.135-1.61a11.81 11.81 0 005.91 1.586h.005c6.637 0 12.05-5.414 12.05-12.048a11.823 11.823 0 00-3.417-8.498z"/>
                            </svg>
                        </div>
                        <div className="hidden lg:flex flex-col leading-none">
                            <span className="font-ui text-[9px] text-gray-mid uppercase tracking-widest mb-1">Direct Liaison</span>
                            <span className="font-ui text-xs text-white uppercase tracking-[2px]">WhatsApp</span>
                        </div>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMenu}
                        className="md:hidden p-4 text-white focus:outline-none border-l border-white/5"
                        aria-label="Toggle Menu"
                    >
                        <div className="w-6 h-5 relative flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Pane - Outside sticky nav to avoid clipping/containing block issues */}
            <div className={`fixed inset-0 top-20 bg-navy-dark z-[60] transition-transform duration-500 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="relative h-full flex flex-col items-center py-12 gap-6 px-8 backdrop-blur-3xl bg-navy-dark/95">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            onClick={closeMenu}
                            className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-ui text-xl tracking-[4px] uppercase text-white hover:bg-strike hover:border-strike transition-all text-center shadow-xl active:scale-95"
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    <div className="mt-8 flex items-center gap-4 bg-ball-pink/10 px-8 py-4 rounded-full border border-ball-pink/30">
                         <span className="w-3 h-3 rounded-full bg-ball-pink animate-pulse shadow-[0_0_12px_#D42080]" />
                         <span className="text-xs font-ui font-black uppercase tracking-[4px] text-ball-pink">Live Unit Stream</span>
                    </div>

                    <div className="mt-12">
                         <img src="/logo-sm.png" alt="Playmasters" className="w-16 h-16 opacity-30 invert" />
                    </div>
                </div>
            </div>
        </>
    );
}
