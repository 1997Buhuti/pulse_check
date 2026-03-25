import React, { useMemo } from 'react';
import { useKudos } from '../hooks/useKudos';
import { Activity, Zap, TrendingUp, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const SentimentWidget = ({ score }) => {
  const vibes = [
    { emoji: '😴', label: 'Idle', color: 'text-gray-500' },
    { emoji: '⚡', label: 'Steady', color: 'text-primary' },
    { emoji: '🚀', label: 'Surging', color: 'text-secondary' },
    { emoji: '🔥', label: 'Electric', color: 'text-tertiary shadow-[0_0_20px_rgba(255,167,255,0.3)]' },
  ];
  
  const vibeIndex = Math.min(Math.floor(score / 5), vibes.length - 1);
  const currentVibe = vibes[vibeIndex];

  return (
    <div className="glass-card p-10 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-surface-container/20 to-surface-low border-primary/20">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-8xl mb-2"
      >
        {currentVibe.emoji}
      </motion.div>
      <div className="space-y-1">
        <h3 className={`text-4xl font-black italic tracking-tighter uppercase ${currentVibe.color}`}>
          {currentVibe.label}
        </h3>
        <p className="text-on-surface-variant font-bold text-xs tracking-widest uppercase">Current Team Momentum</p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { kudos } = useKudos();

  const analytics = useMemo(() => {
    const totalKudos = kudos.length;
    const uniqueContributors = new Set(kudos.map(k => k.fromId)).size;
    
    // Calculate Emoji Distribution
    const emojiMap = kudos.reduce((acc, k) => {
      acc[k.emoji] = (acc[k.emoji] || 0) + 1;
      return acc;
    }, {});
    
    const topVibes = Object.entries(emojiMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emoji, count]) => ({
        tag: emoji,
        percentage: Math.round((count / (totalKudos || 1)) * 100)
      }));

    // Calculate Velocity (Kudos in last 24h)
    const now = Date.now();
    const last24h = kudos.filter(k => (now - k.timestamp) < 24 * 60 * 60 * 1000).length;
    const velocity = (last24h / 24).toFixed(1);

    // Calculate Vibe Score (Scale 0-100 based on activity & variety)
    const vibeScore = Math.min(Math.round((totalKudos * 5) + (Object.keys(emojiMap).length * 10)), 100);

    return { totalKudos, uniqueContributors, topVibes, velocity, vibeScore };
  }, [kudos]);

  const stats = [
    { label: 'TOTAL KUDOS', value: analytics.totalKudos, icon: <Heart className="text-secondary" size={18} />, sub: 'Real-time Pulse' },
    { label: 'ACTIVE MINDS', value: analytics.uniqueContributors, icon: <Activity className="text-primary" size={18} />, sub: 'Contributing DNA' },
    { label: 'PEAK VELOCITY', value: analytics.velocity, icon: <Zap className="text-tertiary" size={18} />, sub: 'Kudos per hour' },
    { label: 'VIBE SCORE', value: analytics.vibeScore, icon: <TrendingUp className="text-emerald-400" size={18} />, sub: 'Culture Heat Level' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-black italic tracking-tighter">ANALYTICS</h2>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">Quantifying the culture glow</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-on-surface-variant tracking-widest uppercase">{stat.label}</span>
              {stat.icon}
            </div>
            <div>
              <p className="text-4xl font-black italic">{stat.value}</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black italic tracking-tighter uppercase">Momentum Arc</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant">
                  <div className="w-2 h-2 rounded-full bg-primary" /> LIVE ACTIVITY
                </div>
              </div>
            </div>
            <div className="flex-1 bg-surface-low border border-outline-variant/10 rounded-2xl flex relative overflow-hidden group">
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent" />
               
               {/* Y-Axis Numerics */}
               <div className="absolute left-4 inset-y-8 flex flex-col justify-between text-[10px] font-black text-on-surface-variant/40 z-10">
                 <span>100</span>
                 <span>50</span>
                 <span>0</span>
               </div>

               {/* X-Axis Time Slots */}
               <div className="absolute bottom-4 inset-x-12 flex justify-between text-[10px] font-black text-on-surface-variant/40 z-10">
                 <span>00:00</span>
                 <span>06:00</span>
                 <span>12:00</span>
                 <span>18:00</span>
                 <span>NOW</span>
               </div>

               {/* Simplified graph placeholder that pulses with actual data */}
               <svg className="absolute inset-0 w-full h-full p-12 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                 <motion.path
                   d={analytics.totalKudos > 0 
                     ? "M 0 80 Q 50 20 100 50 T 200 30 T 300 60 T 400 10" 
                     : "M 0 80 L 400 80"}
                   fill="none"
                   stroke="url(#pulse-grad)"
                   strokeWidth="4"
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 2, ease: "easeInOut" }}
                 />
                 <defs>
                   <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#87adff" />
                     <stop offset="100%" stopColor="#bd82ff" />
                   </linearGradient>
                 </defs>
               </svg>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <SentimentWidget score={analytics.vibeScore} />
          
          <div className="glass-card p-8 space-y-6">
            <h3 className="font-black italic tracking-tighter uppercase">Top Vibes</h3>
            <div className="space-y-4">
               {analytics.topVibes.length > 0 ? analytics.topVibes.map((vibe, i) => (
                 <div key={vibe.tag} className="flex items-center justify-between">
                   <span className="text-xl">{vibe.tag}</span>
                   <div className="flex-1 mx-4 h-1 bg-surface-low rounded-full">
                     <div className={`h-full rounded-full ${i === 0 ? 'bg-tertiary shadow-[0_0_10px_rgba(255,167,255,0.5)]' : 'bg-primary'}`} style={{ width: `${vibe.percentage}%` }} />
                   </div>
                   <span className="text-xs font-black">{vibe.percentage}%</span>
                 </div>
               )) : (
                 <p className="text-center text-xs text-on-surface-variant italic py-4">No data yet</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
