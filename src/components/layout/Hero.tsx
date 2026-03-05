'use client';

import React from 'react';

export default function ModernHero() {
    return (
        <div className="w-full min-h-[85vh] flex flex-col items-center justify-center bg-navy-dark relative overflow-hidden border-b border-white/5 pt-20">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1A2280 1px, transparent 1px), linear-gradient(to bottom, #1A2280 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />

            {/* Top Label */}
            <div className="z-10 mb-6 flex items-center gap-3">
                <div className="h-[2px] w-8 bg-strike" />
                <span className="font-ui text-strike uppercase tracking-[6px] text-sm font-bold">
                    Official Team Headquarters
                </span>
                <div className="h-[2px] w-8 bg-strike" />
            </div>

            {/* Main Title - LARGER Logo & Wordmark */}
            <div className="z-10 text-center px-4 flex flex-col items-center">
                <div className="relative w-64 h-64 md:w-[450px] md:h-[450px] mb-4">
                    <img
                        src="/logo.png"
                        alt="Playmasters Official Logo"
                        className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(232,32,48,0.4)] animate-float"
                    />
                </div>
                <h1 className="font-wordmark text-[clamp(44px,10vw,120px)] leading-[0.8] text-white tracking-tight uppercase flex items-center gap-4 -mt-12 md:-mt-20">
                    <span>Play</span>
                    <span className="text-strike relative inline-block">
                        Masters
                        <span className="absolute -inset-1 border-2 border-strike/30 -skew-x-12 pointer-events-none" />
                    </span>
                </h1>
                <div className="mt-4 flex items-center justify-center gap-4">
                    <span className="font-ui text-2xl text-ball-pink tracking-[8px] uppercase">Kenya</span>
                    <div className="h-6 w-[1px] bg-white/20" />
                    <span className="font-title italic text-gray-mid text-lg">Est. 1994</span>
                </div>
            </div>

            {/* Data Panels */}
            <div className="z-10 mt-12 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 border-y border-white/10 bg-navy-dark/50 backdrop-blur-md">
                <div className="p-8 border-r border-white/10 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-white/[0.02]">
                    <span className="font-ui text-gray-mid uppercase tracking-widest text-xs">Total Pins Down</span>
                    <span className="font-wordmark text-5xl text-white group-hover:text-strike transition-colors">46,820</span>
                </div>
                <div className="p-8 border-r border-white/10 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-white/[0.02]">
                    <span className="font-ui text-gray-mid uppercase tracking-widest text-xs">Strike Rate</span>
                    <span className="font-wordmark text-5xl text-white group-hover:text-ball-pink transition-colors">78.4%</span>
                </div>
                <div className="p-8 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-white/[0.02]">
                    <span className="font-ui text-gray-mid uppercase tracking-widest text-xs">Active Roster</span>
                    <span className="font-wordmark text-5xl text-white group-hover:text-bat-blue transition-colors">14</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.02); }
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
