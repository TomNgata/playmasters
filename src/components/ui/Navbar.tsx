import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full border-b border-white/5 bg-navy-dark/90 backdrop-blur-md sticky top-0 z-50 overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center h-20">
                {/* Logo Section */}
                <Link href="/" className="px-8 flex items-center gap-4 border-r border-white/5 h-full group hover:bg-white/[0.02] transition-colors">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <img
                            src="/logo-sm.png"
                            alt="Playmasters Logo"
                            className="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_8px_#E82030] transition-all"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-wordmark text-xl text-white uppercase tracking-wider">
                            Play<span className="text-strike">Masters</span>
                        </span>
                        <span className="font-ui text-[8px] text-gray-mid tracking-[3px] uppercase mt-1">Kenya Unit</span>
                    </div>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex flex-1 h-full items-center justify-center font-ui text-lg tracking-[4px] uppercase text-gray-mid">
                    <Link href="/dashboard/player" className="px-8 hover:text-white transition-colors border-r border-white/5 h-full flex items-center hover:bg-white/[0.02]">Player Hub</Link>
                    <Link href="/standings" className="px-8 hover:text-white transition-colors border-r border-white/5 h-full flex items-center hover:bg-white/[0.02]">Rivalry Matrix</Link>
                    <Link href="/dashboard/player/log-game" className="px-8 hover:text-white transition-colors border-r border-white/5 h-full flex items-center hover:bg-white/[0.02]">Log Score</Link>
                    <Link href="/merch" className="px-8 hover:text-white transition-colors h-full flex items-center hover:bg-white/[0.02]">Merch Kit</Link>
                </div>
            </div>
        </nav>
    );
}
