import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full border-b border-white/5 bg-navy-dark/90 backdrop-blur-md sticky top-0 z-50 overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center h-20">
                {/* Logo Section */}
                <Link href="/" className="px-8 flex items-center gap-3 border-r border-white/5 h-full group hover:bg-white/[0.02] transition-colors">
                    <div className="w-6 h-6 rounded-full bg-strike group-hover:scale-110 group-hover:shadow-[0_0_15px_#E82030] transition-all" />
                    <span className="font-wordmark text-2xl text-white uppercase tracking-wider">
                        Play<span className="text-strike">Masters</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex flex-1 h-full items-center justify-center font-ui text-lg tracking-[4px] uppercase text-gray-mid">
                    <Link href="/dashboard/player" className="px-8 hover:text-white transition-colors border-r border-white/5 h-full flex items-center hover:bg-white/[0.02]">Player Hub</Link>
                    <Link href="/standings" className="px-8 hover:text-white transition-colors border-r border-white/5 h-full flex items-center hover:bg-white/[0.02]">Standings</Link>
                    <Link href="/merch" className="px-8 hover:text-white transition-colors h-full flex items-center hover:bg-white/[0.02]">Merch Kit</Link>
                </div>

                {/* Status & CTA */}
                <div className="px-8 flex items-center gap-6 h-full border-l border-white/5 bg-navy-dark/40">
                    <div className="flex flex-col items-end leading-none font-ui uppercase">
                        <span className="text-strike text-[10px] font-extrabold tracking-widest">Live Status</span>
                        <span className="text-white text-xs tracking-widest">Westgate Active</span>
                    </div>
                    <Link href="/dashboard/player" className="px-6 py-2 bg-strike hover:bg-strike-deep text-white font-ui text-lg tracking-widest uppercase transition-all shadow-[0_4px_0_theme(colors.strike-deep)] active:translate-y-[2px] active:shadow-none">
                        Log Score
                    </Link>
                </div>
            </div>
        </nav>
    );
}
