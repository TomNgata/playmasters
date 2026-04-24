'use client';

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type PlayerStats = {
  id: string;
  name: string;
  role: string;
  gamesPlayed: number;
  totalPins: number;
  average: number;
};

type TeamStats = {
  id: string;
  name: string;
  players: PlayerStats[];
  totalGames: number;
  totalPins: number;
  teamAverage: number;
};

export default function AdminDashboard() {
  const [teamsData, setTeamsData] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // Fetch teams, profiles, and scores concurrently
      const [teamsRes, profilesRes, scoresRes] = await Promise.all([
        supabase.from('teams').select('id, name').ilike('name', '%Playmasters%'),
        supabase.from('profiles').select('id, name, display_name, team_id, role').not('team_id', 'is', null),
        supabase.from('game_scores').select('scratch_score, player_id, team_id')
      ]);

      if (teamsRes.error) throw teamsRes.error;
      if (profilesRes.error) throw profilesRes.error;
      if (scoresRes.error) throw scoresRes.error;

      const teams = teamsRes.data || [];
      const profiles = profilesRes.data || [];
      const scores = scoresRes.data || [];

      // Calculate stats per player
      const playerStatsMap: Record<string, { games: number; pins: number }> = {};
      scores.forEach(s => {
        if (!playerStatsMap[s.player_id]) {
          playerStatsMap[s.player_id] = { games: 0, pins: 0 };
        }
        playerStatsMap[s.player_id].games += 1;
        playerStatsMap[s.player_id].pins += s.scratch_score;
      });

      // Group players into teams
      const processedTeams: TeamStats[] = teams.map(team => {
        const teamPlayers = profiles.filter(p => p.team_id === team.id);
        const players: PlayerStats[] = teamPlayers.map(p => {
          const stats = playerStatsMap[p.id] || { games: 0, pins: 0 };
          return {
            id: p.id,
            name: p.display_name || p.name || 'Unknown',
            role: p.role,
            gamesPlayed: stats.games,
            totalPins: stats.pins,
            average: stats.games > 0 ? Math.round(stats.pins / stats.games) : 0,
          };
        }).sort((a, b) => b.average - a.average);

        const totalGames = players.reduce((sum, p) => sum + p.gamesPlayed, 0);
        const totalPins = players.reduce((sum, p) => sum + p.totalPins, 0);
        const teamAverage = totalGames > 0 ? Math.round(totalPins / totalGames) : 0;

        return {
          id: team.id,
          name: team.name,
          players,
          totalGames,
          totalPins,
          teamAverage,
        };
      }).sort((a, b) => b.teamAverage - a.teamAverage);

      setTeamsData(processedTeams);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !mounted) return (
    <div className="min-h-screen bg-[#080B3A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(239,68,68,0.3)]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080B3A] text-white font-sans pb-24 selection:bg-red-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-red-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2 animate-in fade-in slide-in-from-left duration-500">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase italic">Management Access</span>
              <span className="h-px w-12 bg-white/20" />
            </div>
            <h1 className="text-5xl sm:text-7xl font-['Barlow_Condensed'] font-black italic tracking-tighter text-white uppercase leading-none">
              ADMIN <span className="text-red-600">COMMAND</span>
            </h1>
            <p className="text-[#8A8EBB] font-mono text-xs uppercase tracking-[0.3em] font-medium opacity-80">
              Playmasters Executive Overview // Aggregate Intelligence
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">System Active</span>
          </div>
        </header>

        <div className="space-y-12">
          {teamsData.map((team) => (
            <section key={team.id} className="group relative">
              {/* Glass Border Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-[2rem] opacity-50 transition-opacity group-hover:opacity-100" />
              
              <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Team Header */}
                <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-white/5 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(232,32,48,0.3)]">
                      <span className="text-2xl font-black italic tracking-tighter">PM</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-['Barlow_Condensed'] font-black uppercase italic tracking-tight">{team.name}</h2>
                      <p className="text-xs text-[#8A8EBB] uppercase tracking-[0.2em] font-bold">Roster Size: {team.players.length} Active</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-full md:w-auto">
                    <div className="text-center">
                      <p className="text-[10px] text-[#8A8EBB] uppercase tracking-[0.2em] font-bold mb-1">Team Avg</p>
                      <p className="text-3xl font-['Barlow_Condensed'] font-black italic text-emerald-400 leading-none">{team.teamAverage}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-[10px] text-[#8A8EBB] uppercase tracking-[0.2em] font-bold mb-1">Total Pins</p>
                      <p className="text-2xl font-['Barlow_Condensed'] font-black italic text-white leading-none">{team.totalPins.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Player Roster Matrix */}
                <div className="overflow-x-auto p-4 md:p-6">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-[#8A8EBB] text-[10px] uppercase font-black tracking-[3px]">
                        <th className="px-6 py-3">Operative</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3 text-center">Deployments (Games)</th>
                        <th className="px-6 py-3 text-right">Pinfall</th>
                        <th className="px-6 py-3 text-right">Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.players.map((p) => (
                        <tr key={p.id} className="group/row transition-all duration-300 hover:scale-[1.01] bg-white/[0.02] hover:bg-white/[0.05] border-l-4 border-l-white/5 hover:border-l-red-500">
                          <td className="px-6 py-4 rounded-l-2xl">
                            <span className="text-xl font-['Barlow_Condensed'] font-black uppercase italic tracking-wider">
                              {p.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                              p.role === 'captain' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-[#8A8EBB] border border-white/10'
                            }`}>
                              {p.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-['Barlow_Condensed'] text-xl">{p.gamesPlayed}</td>
                          <td className="px-6 py-4 text-right font-['Barlow_Condensed'] text-xl text-white/80">{p.totalPins.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right rounded-r-2xl">
                            <span className="text-2xl font-['Barlow_Condensed'] font-black italic text-emerald-400">
                              {p.average}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {team.players.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-[#8A8EBB] font-mono text-xs uppercase tracking-widest bg-white/[0.02] rounded-2xl">
                            No active operatives found in this unit.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
