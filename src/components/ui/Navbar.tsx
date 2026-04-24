'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  Info, 
  Trophy, 
  Users, 
  Handshake, 
  Heart, 
  MessageSquare, 
  LayoutDashboard,
  Menu,
  X,
  Camera
} from 'lucide-react';

const publicLinks = [
  { name: 'About', href: '/about', icon: Info },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Players', href: '/players', icon: Users },
  { name: 'Sponsors', href: '/sponsors', icon: Handshake },
  { name: 'Gallery', href: '/gallery', icon: Camera },
  { name: 'CSR', href: '/csr', icon: Heart },
  { name: 'Contact', href: '/contact', icon: MessageSquare },
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
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo-lg.svg"
                alt="Playmasters Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_12px_#E82030] transition-all"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-wordmark text-xl text-white uppercase tracking-wider group-hover:text-glow transition-all">
                Play<span className="text-strike">Masters</span>
              </span>
              <span className="font-ui text-[8px] text-gray-mid tracking-[3px] uppercase mt-0.5">Kenya</span>
            </div>
          </Link>

          {/* Desktop Public Nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 font-ui text-sm tracking-[2px] uppercase transition-all rounded-sm flex items-center gap-2 glass-glow ${
                    isActive
                      ? 'text-white bg-white/5 border-b-2 border-strike'
                      : 'text-gray-mid hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-strike' : 'opacity-50'} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Team Hub CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link
              href="/login"
              className="px-5 py-2.5 bg-strike hover:bg-strike-deep text-white font-ui font-bold text-sm tracking-[3px] uppercase transition-all shadow-[0_2px_10px_rgba(232,32,48,0.3)] active:translate-y-[1px] active:shadow-none flex items-center gap-2 glass-glow overflow-hidden"
            >
              <LayoutDashboard size={16} />
              Team Hub
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-white focus:outline-none glass-glow rounded-lg"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <div className={`fixed inset-0 top-[72px] bg-navy-dark z-[60] transition-transform duration-400 lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full px-6 py-8 gap-3 overflow-y-auto">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`w-full py-4 px-6 border rounded-xl font-ui text-xl tracking-[4px] uppercase transition-all flex items-center justify-center gap-4 ${
                  isActive
                    ? 'bg-strike border-strike text-white shadow-[0_0_20px_rgba(232,32,48,0.4)]'
                    : 'bg-white/5 border-white/10 text-white hover:bg-strike/20 hover:border-strike/40'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-strike'} />
                {link.name}
              </Link>
            );
          })}

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/login"
              onClick={closeMenu}
              className="w-full py-4 px-6 bg-navy-mid border border-white/10 text-white font-ui text-xl tracking-[4px] uppercase transition-all text-center rounded-xl flex items-center justify-center gap-3 glass-glow"
            >
              <LayoutDashboard size={24} />
              Team Hub
            </Link>
          </div>

          <div className="mt-auto pt-8 flex justify-center">
            <Image src="/logo-lg.svg" alt="Playmasters" width={60} height={60} className="opacity-20 grayscale brightness-200" />
          </div>
        </div>
      </div>
    </>
  );
}
