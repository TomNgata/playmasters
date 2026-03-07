'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { name: 'Player Hub', href: '/dashboard/player' },
        { name: 'Competition Analysis', href: '/dashboard/player#competition' },
        { name: 'Log Score', href: '/dashboard/player/log-game' }
    ];

    return (
        <nav className="w-full border-b border-white/5 bg-navy-dark/90 backdrop-blur-md sticky top-0 z-50 overflow-hidden">
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
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={toggleMenu}
                    className="md:hidden p-4 text-white focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between">
                        <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Mobile Navigation Pane */}
            <div className={`fixed inset-0 top-20 bg-navy-dark/95 backdrop-blur-xl z-40 transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col items-center py-12 gap-8 px-6">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            onClick={closeMenu}
                            className="font-ui text-2xl tracking-[6px] uppercase text-gray-mid hover:text-strike transition-colors text-center w-full pb-4 border-b border-white/5"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mt-8">
                         <img src="/logo-sm.png" alt="Playmasters" className="w-16 h-16 opacity-20 grayscale" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
