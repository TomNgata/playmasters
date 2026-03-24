'use client';
import { useState } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate sending
        await new Promise(r => setTimeout(r, 1500));
        setStatus('sent');
    };

    if (status === 'sent') {
        return (
            <div className="bg-navy border border-strike/30 p-12 rounded-2xl text-center">
                <div className="w-16 h-16 bg-strike/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚡</div>
                <h3 className="font-wordmark text-3xl uppercase text-white mb-2">Message Received</h3>
                <p className="font-ui text-gray-mid uppercase tracking-widest text-xs">The Squad will reach out soon.</p>
                <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 font-ui text-strike uppercase tracking-[4px] text-xs hover:underline"
                >
                    Send Another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-navy border border-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-strike/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-strike/10 transition-colors" />
            
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <label className="font-ui text-gray-mid uppercase tracking-[3px] text-[10px] font-bold">Full Name</label>
                    <input 
                        required
                        type="text" 
                        placeholder="Master Bowler"
                        className="bg-navy-dark/50 border-b border-white/10 py-3 px-1 text-white font-sans focus:outline-none focus:border-strike transition-colors placeholder:text-gray-dark"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-ui text-gray-mid uppercase tracking-[3px] text-[10px] font-bold">WhatsApp / Cell</label>
                    <input 
                        required
                        type="tel" 
                        placeholder="+254..."
                        className="bg-navy-dark/50 border-b border-white/10 py-3 px-1 text-white font-sans focus:outline-none focus:border-strike transition-colors placeholder:text-gray-dark"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-ui text-gray-mid uppercase tracking-[3px] text-[10px] font-bold">Your Intent</label>
                    <textarea 
                        required
                        rows={3}
                        placeholder="I want to join the league / Collaborate / Book a session"
                        className="bg-navy-dark/50 border-b border-white/10 py-3 px-1 text-white font-sans focus:outline-none focus:border-strike transition-all placeholder:text-gray-dark resize-none"
                    ></textarea>
                </div>

                <button 
                    disabled={status === 'sending'}
                    className="w-full py-5 bg-strike hover:bg-strike-deep text-white font-ui font-extrabold tracking-[4px] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {status === 'sending' ? 'TRANSMITTING...' : (
                        <span className="flex items-center justify-center gap-2">
                            Join the Squad <span className="text-white/40 group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
}
