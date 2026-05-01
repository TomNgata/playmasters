import Link from 'next/link';

export default function DashboardLandingPage() {
  return (
    <div className="min-h-screen bg-[#080B3A] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden pb-32">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-red-600 blur-[200px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-purple-600 blur-[200px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500 mt-16">
        <div className="px-3 py-1 bg-red-600 text-[10px] font-black uppercase tracking-[2px] rounded italic mb-4">Team Hub</div>
        <h2 className="font-['Barlow_Condensed'] text-[clamp(40px,8vw,80px)] text-white mb-8 uppercase font-black italic tracking-tight leading-none text-center">
          Stop Guessing. <br /> <span className="text-red-600">Start Striking.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full border border-white/10 bg-[#0D1245]/80 backdrop-blur-xl mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-start text-left group hover:bg-white/[0.03] transition-colors">
            <span className="font-sans text-pink-400 text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">The Elite Edge</span>
            <h3 className="font-['Barlow_Condensed'] text-3xl uppercase tracking-tighter text-white mb-4 italic font-black group-hover:text-pink-400 transition-colors">Pro Performance</h3>
            <p className="text-sm font-sans text-gray-400 leading-relaxed font-medium">Gain the competitive edge with advanced performance tracking that turns every frame into a masterclass in precision.</p>
          </div>
          <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-start text-left group hover:bg-white/[0.03] transition-colors">
            <span className="font-sans text-blue-400 text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Strategic Insight</span>
            <h3 className="font-['Barlow_Condensed'] text-3xl uppercase tracking-tighter text-white mb-4 italic font-black group-hover:text-blue-400 transition-colors">Rivalry Tracking</h3>
            <p className="text-sm font-sans text-gray-400 leading-relaxed font-medium">Know your competition. Stay ahead of the pack with real-time benchmarks and head-to-head metrics designed for winners.</p>
          </div>
          <div className="p-8 lg:p-12 flex flex-col items-start text-left group hover:bg-white/[0.03] transition-colors">
            <span className="font-sans text-red-500 text-xs font-bold tracking-[3px] uppercase mb-4 opacity-70">Championship Tools</span>
            <h3 className="font-['Barlow_Condensed'] text-3xl uppercase tracking-tighter text-white mb-4 italic font-black group-hover:text-red-500 transition-colors">Digital Clubhouse</h3>
            <p className="text-sm font-sans text-gray-400 leading-relaxed font-medium">Manage your bowling legacy. From automated tournament brackets to career high-scores, your journey is archived here.</p>
          </div>
        </div>
      </div>

      {/* Global Nav CTA */}
      <div className="fixed bottom-0 left-0 w-full p-6 flex justify-center pointer-events-none z-50">
          <div className="flex gap-4 p-2 bg-[#0D1245]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl pointer-events-auto">
              <Link href="/dashboard" className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-red-500">Global Intel</Link>
              <div className="w-px h-4 bg-white/10 my-auto" />
              <Link href="/dashboard/player" className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">My Station</Link>
              <div className="w-px h-4 bg-white/10 my-auto" />
              <Link href="/dashboard/competition" className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">War Room</Link>
          </div>
      </div>
    </div>
  );
}
