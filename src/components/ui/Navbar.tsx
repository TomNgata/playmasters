'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const publicLinks = [
  { name: 'About', href: '/about' },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Players', href: '/players' },
  { name: 'Sponsors', href: '/sponsors' },
  { name: 'CSR', href: '/csr' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-dark/98 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-navy-dark/95'} backdrop-blur-xl border-b border-white/5`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-18 px-4 lg:px-6" style={{ height: '72px' }}>

          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img
                src="/logo-sm.png"
                alt="Playmasters Logo"
                className="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_8px_#E82030] transition-all"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-wordmark text-lg text-white uppercase tracking-wider">
                Play<span className="text-strike">Masters</span>
              </span>
              <span className="font-ui text-[8px] text-gray-mid tracking-[2px] uppercase mt-0.5">Kenya</span>
            </div>
          </Link>

          {/* Desktop Public Nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 font-ui text-sm tracking-[3px] uppercase transition-all rounded-sm ${
                    isActive
                      ? 'text-white bg-white/5 border-b-2 border-strike'
                      : 'text-gray-mid hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Team Hub CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link
              href="/dashboard/player"
              className="px-5 py-2.5 bg-strike hover:bg-strike-deep text-white font-ui font-bold text-sm tracking-[3px] uppercase transition-all shadow-[0_2px_0_theme(colors.strike-deep)] active:translate-y-[1px] active:shadow-none flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Team Hub
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <div className={`fixed inset-0 top-[72px] bg-navy-dark z-[60] transition-transform duration-400 lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full px-6 py-8 gap-3 overflow-y-auto">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`w-full py-4 px-6 border rounded-xl font-ui text-xl tracking-[4px] uppercase transition-all text-center ${
                  isActive
                    ? 'bg-strike border-strike text-white'
                    : 'bg-white/5 border-white/10 text-white hover:bg-strike/20 hover:border-strike/40'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/dashboard/player"
              onClick={closeMenu}
              className="w-full py-4 px-6 bg-strike border border-strike text-white font-ui text-xl tracking-[4px] uppercase transition-all text-center rounded-xl flex items-center justify-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Team Hub (Login)
            </Link>
          </div>

          <div className="mt-auto pt-8 flex justify-center">
            <img src="/logo-sm.png" alt="Playmasters" className="w-12 h-12 opacity-20" />
          </div>
        </div>
      </div>
    </>
  );
}
