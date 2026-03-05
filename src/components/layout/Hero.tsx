'use client';

import React from 'react';

export default function ModernHero() {
    return (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-navy-dark relative overflow-hidden border-b border-white/5 pt-20">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1A2280 1px, transparent 1px), linear-gradient(to bottom, #1A2280 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />

            {/* Top Label */}
            <div className="z-10 mb-8 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-strike" />
                <span className="font-ui text-strike uppercase tracking-[6px] text-sm font-bold">
                    Official Team Headquarters
                </span>
                <div className="h-[2px] w-8 bg-strike" />
            </div>

            {/* Main Title - Logo & Wordmark */}
            <div className="z-10 text-center px-4 flex flex-col items-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
                    <img
                        src="/logo.jpg"
                        alt="Playmasters Official Logo"
                        className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(232,32,48,0.3)] animate-float"
                    />
                </div>
                <h1 className="font-wordmark text-[clamp(48px,12vw,140px)] leading-[0.8] text-white tracking-tight uppercase flex items-center gap-4">
                    <span>Play</span>
                    <span className="text-strike relative inline-block">
                        Masters
                        <span className="absolute -inset-1 border-2 border-strike/30 -skew-x-12 pointer-events-none" />
                    </span>
                </h1>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <span className="font-ui text-3xl text-ball-pink tracking-[8px] uppercase">Kenya</span>
                    <div className="h-6 w-[1px] bg-white/20" />
                    <span className="font-title italic text-gray-mid text-xl">Est. 1994</span>
                </div>
            </div>

            {/* Data Panels - Inspired by Election Flyer */}
            <div className="z-10 mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 border-y border-white/10 bg-navy-dark/50 backdrop-blur-md">
                <div className="p-8 border-r border-white/10 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-white/[0.02]">
                    <span className="font-ui text-gray-mid uppercase tracking-widest text-xs">Total Pins Down</span>
                    <span className="font-wordmark text-5xl text-white group-hover:text-strike transition-colors">46,820</span>
                    <span className="font-ui text-strike text-sm font-bold">+12% vs last month</span>
                </div>
                <div className="p-8 border-r border-white/10 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-white/[0.02]">
                    <span className="font-ui text-gray-mid uppercase tracking-widest text-xs">Strike Rate</span>
                    <span className="font-wordmark text-5xl text-white group-hover:text-ball-pink transition-colors">78.4%</span>
                    <span className="py-1 px-3 bg-ball-pink/10 border border-ball-pink/20 rounded-full font-ui text-ball-pink text-xs font-bold uppercase tracking-wider">Elite Tier</span>
                </div>
                <div className="p-8 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-white/[0.02]">
                    <span className="font-ui text-gray-mid uppercase tracking-widest text-xs">Active Roster</span>
                    <span className="font-wordmark text-5xl text-white group-hover:text-bat-blue transition-colors">14</span>
                    <span className="font-ui text-bat-blue text-sm font-bold">2 Slots Available</span>
                </div>
            </div>

            {/* Bottom Tagline */}
            <div className="z-10 mt-8 font-title italic text-gray-dark tracking-wide">
                &quot;One lane. Ten pins. Zero excuses.&quot;
            </div>

            {/* Visual Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-strike/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-bat-blue/5 blur-[150px] rounded-full" />

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
