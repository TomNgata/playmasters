'use client';

import { Mail, Phone, Instagram, MapPin } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export default function ContactPage() {

  return (
    <main className="min-h-screen bg-navy-dark text-white overflow-x-hidden">
      
      {/* ─── Hero ─── */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-strike via-ball-pink to-bat-blue" />
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="font-wordmark text-[18vw] text-white/[0.025] uppercase whitespace-nowrap">CONNECT</span>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-ui text-strike text-sm tracking-[6px] uppercase font-bold">Get In Touch</span>
          <h1 className="font-wordmark text-[clamp(40px,8vw,96px)] uppercase leading-none">
            Contact <span className="text-strike">Us</span>
          </h1>
          <p className="font-sans text-gray-mid text-lg md:text-xl max-w-2xl leading-relaxed">
            Whether you&apos;re a player looking to join, a brand seeking partnership, or a fan with a question — we&apos;re here.
          </p>
        </div>
      </section>

      {/* ─── Contact Grid ─── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="flex flex-col gap-10">
          <div>
            <SectionHeader label="HQ" title="Contact Details" subtitle="How to reach us" />
            <p className="font-sans text-gray-mid leading-relaxed mt-6">
              Our team operates primarily across Nairobi&apos;s leading bowling lanes. For official enquiries, please reach out via the following channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-navy border border-white/8 rounded-2xl p-6 glass-glow">
              <Mail className="text-strike mb-4" size={24} />
              <h3 className="font-ui text-sm tracking-[2px] uppercase text-white mb-1">Email Us</h3>
              <a href="mailto:playmasters.bowling@gmail.com" className="font-sans text-sm text-gray-mid hover:text-white transition-colors lowercase">
                playmasters.bowling@gmail.com
              </a>
            </div>
            
            <div className="bg-navy border border-white/8 rounded-2xl p-6 glass-glow">
              <Instagram className="text-ball-pink mb-4" size={24} />
              <h3 className="font-ui text-sm tracking-[2px] uppercase text-white mb-1">Instagram</h3>
              <a href="https://instagram.com/playmasterske" target="_blank" className="font-sans text-sm text-gray-mid hover:text-white transition-colors">
                @playmasterske
              </a>
            </div>

            <div className="bg-navy border border-white/8 rounded-2xl p-6 glass-glow">
              <MapPin className="text-bat-blue mb-4" size={24} />
              <h3 className="font-ui text-sm tracking-[2px] uppercase text-white mb-1">Based In</h3>
              <p className="font-sans text-sm text-gray-mid">
                Nairobi, Kenya (Various Lanes)
              </p>
            </div>

            <div className="bg-navy border border-white/8 rounded-2xl p-6 glass-glow">
              <Phone className="text-strike mb-4" size={24} />
              <h3 className="font-ui text-sm tracking-[2px] uppercase text-white mb-1">Official Line</h3>
              <p className="font-sans text-sm text-gray-mid">
                Contact via Email/Insta preferred
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-navy border border-white/8 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-strike" />
          
          <div className="w-20 h-20 bg-strike/10 rounded-full flex items-center justify-center mb-8 border border-strike/20">
            <Instagram className="text-strike" size={36} />
          </div>
          
          <h2 className="font-wordmark text-4xl md:text-5xl uppercase mb-6 leading-tight">
            Let&apos;s Talk on <span className="text-strike">Instagram</span>
          </h2>
          
          <p className="font-sans text-gray-mid text-lg max-w-sm mx-auto mb-10 leading-relaxed">
            The fastest way to reach our management or squad captains is via Instagram DM. We respond to all serious enquiries within 24 hours.
          </p>
          
          <a 
            href="https://ig.me/m/playmasterske" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-6 bg-strike hover:bg-strike-deep text-white font-ui font-bold text-xl tracking-[6px] uppercase transition-all shadow-[0_4px_30px_rgba(232,32,48,0.4)] active:translate-y-[2px] flex items-center justify-center gap-4 glass-glow"
          >
            Open Instagram DM
            <Instagram size={24} />
          </a>
          
          <p className="mt-8 font-ui text-[10px] tracking-[3px] uppercase text-gray-dark">
            Direct Link to @playmasterske
          </p>
        </div>
      </section>

    </main>
  );
}
