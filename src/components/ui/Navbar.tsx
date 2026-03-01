import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full border-b border-white/5 bg-navy-void/90 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="font-wordmark text-2xl tracking-wide flex items-center gap-2 text-white uppercase">
                    <div className="w-6 h-6 rounded-full bg-strike animate-pulse shadow-[0_0_10px_#E82030]" />
                    PLAY<span className="text-strike">MASTERS</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 font-ui text-lg tracking-widest uppercase text-playgray-mid">
                    <Link href="/dashboard/player" className="hover:text-white transition-colors">Player HQ</Link>
                    <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
                    <Link href="/merch" className="hover:text-white transition-colors">Merch</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/player" className="px-5 py-2 rounded-md bg-strike/10 hover:bg-strike/20 text-strike font-ui text-lg tracking-widest uppercase transition-colors border border-strike/50">
                        Log Score
                    </Link>
                </div>
            </div>
        </nav>
    );
}
