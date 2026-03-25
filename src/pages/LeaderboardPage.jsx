import React from 'react';
import { useKudos } from '../hooks/useKudos';
import { Trophy, Medal, Star, ArrowUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaderboardPage = () => {
  const { kudos } = useKudos();

  // Aggregate kudos per recipient
  const rankings = kudos.reduce((acc, kudo) => {
    acc[kudo.to] = (acc[kudo.to] || 0) + 1;
    return acc;
  }, {});

  const sortedRankings = Object.entries(rankings)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black italic tracking-tighter">LEADERBOARD</h2>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">Elite momentum contributors</p>
      </header>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-6 pt-12">
        {/* 2nd Place */}
        {sortedRankings[1] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center group"
          >
            <div className="w-24 h-24 rounded-full bg-surface-container border-2 border-primary/30 flex items-center justify-center mb-4 relative shadow-[0_0_20px_rgba(135,173,255,0.1)] group-hover:scale-105 transition-transform">
              <span className="text-2xl font-black italic">{sortedRankings[1].name[0]}</span>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-surface-high border border-primary/20 rounded-full flex items-center justify-center">
                <Medal size={16} className="text-primary" />
              </div>
            </div>
            <div className="h-32 w-28 bg-surface-low border-x border-t border-outline-variant/10 rounded-t-2xl flex flex-col items-center justify-center p-4">
              <span className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-widest">2nd</span>
              <span className="text-sm font-bold truncate w-full text-center tracking-tight">{sortedRankings[1].name}</span>
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {sortedRankings[0] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center group"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1 mb-4 relative shadow-[0_0_40px_rgba(135,173,255,0.3)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-surface-container rounded-full flex items-center justify-center">
                <span className="text-4xl font-black italic">{sortedRankings[0].name[0]}</span>
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary shadow-lg border-2 border-white/20 rounded-full flex items-center justify-center">
                <Trophy size={20} className="text-white fill-white" />
              </div>
            </div>
            <div className="h-44 w-36 bg-surface-container border-x border-t border-primary/30 rounded-t-3xl flex flex-col items-center justify-center p-4 shadow-[0_-10px_20px_rgba(135,173,255,0.05)]">
              <span className="text-sm font-black text-primary mb-1 uppercase tracking-tighter">CHAMPION</span>
              <span className="text-lg font-black italic truncate w-full text-center tracking-tighter">{sortedRankings[0].name}</span>
              <span className="text-2xl font-black text-white mt-1">{sortedRankings[0].count} <span className="text-[10px] text-on-surface-variant font-bold">KUDOS</span></span>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {sortedRankings[2] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center group"
          >
            <div className="w-20 h-20 rounded-full bg-surface-container border-2 border-secondary/30 flex items-center justify-center mb-4 relative shadow-[0_0_20px_rgba(189,130,255,0.1)] group-hover:scale-105 transition-transform">
              <span className="text-xl font-black italic">{sortedRankings[2].name[0]}</span>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-surface-high border border-secondary/20 rounded-full flex items-center justify-center">
                <Star size={14} className="text-secondary fill-secondary" />
              </div>
            </div>
            <div className="h-24 w-24 bg-surface-low/80 border-x border-t border-outline-variant/10 rounded-t-xl flex flex-col items-center justify-center p-4">
              <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">3rd</span>
              <span className="text-xs font-bold truncate w-full text-center tracking-tight">{sortedRankings[2].name}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* List Feed */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-low/50 border-b border-outline-variant/10">
              <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant tracking-widest uppercase">Rank</th>
              <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant tracking-widest uppercase">Teammate</th>
              <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant tracking-widest uppercase">Recognition Score</th>
              <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant tracking-widest uppercase text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sortedRankings.slice(3).map((player, idx) => (
              <tr key={player.name} className="border-b border-outline-variant/5 hover:bg-surface-high/30 transition-colors group">
                <td className="px-8 py-5 font-black text-on-surface-variant italic">#{idx + 4}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-high border border-outline-variant/20 flex items-center justify-center text-xs font-bold">
                      {player.name[0]}
                    </div>
                    <span className="font-bold text-on-surface group-hover:text-primary transition-colors">{player.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-[100px] h-1.5 bg-surface-low rounded-full overflow-hidden">
                      <div className="h-full bg-secondary shadow-[0_0_10px_rgba(189,130,255,0.5)]" style={{ width: `${(player.count / sortedRankings[0].count) * 100}%` }} />
                    </div>
                    <span className="text-sm font-black">{player.count}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                    <ArrowUp size={12} /> 12%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
