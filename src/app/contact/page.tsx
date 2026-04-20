'use client';

import { useState } from 'react';
import { Mail, Phone, Instagram, MapPin, Send } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

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

        {/* Contact Form */}
        <div className="bg-navy border border-white/8 rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-strike" />
          
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-strike/20 rounded-full flex items-center justify-center mb-6">
                <Send className="text-strike" size={32} />
              </div>
              <h3 className="font-wordmark text-3xl uppercase mb-2">Message Sent!</h3>
              <p className="font-sans text-gray-mid max-w-sm mx-auto">
                Thank you for reaching out. A PlayMasters representative will be in touch shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 font-ui text-xs tracking-[4px] uppercase text-strike hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-ui text-[10px] tracking-[3px] uppercase text-gray-mid ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    placeholder="Enter your name" 
                    className="bg-navy-dark border border-white/10 rounded-xl px-5 py-4 font-sans text-white placeholder:text-gray-dark focus:border-strike outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-ui text-[10px] tracking-[3px] uppercase text-gray-mid ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    placeholder="name@example.com" 
                    className="bg-navy-dark border border-white/10 rounded-xl px-5 py-4 font-sans text-white placeholder:text-gray-dark focus:border-strike outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-ui text-[10px] tracking-[3px] uppercase text-gray-mid ml-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formState.subject}
                  onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  placeholder="What is this regarding?" 
                  className="bg-navy-dark border border-white/10 rounded-xl px-5 py-4 font-sans text-white placeholder:text-gray-dark focus:border-strike outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-ui text-[10px] tracking-[3px] uppercase text-gray-mid ml-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  placeholder="How can we help?" 
                  className="bg-navy-dark border border-white/10 rounded-xl px-5 py-4 font-sans text-white placeholder:text-gray-dark focus:border-strike outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-5 bg-strike hover:bg-strike-deep text-white font-ui font-bold text-lg tracking-[5px] uppercase transition-all shadow-[0_4px_20px_rgba(232,32,48,0.3)] active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 glass-glow"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}
