import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import { 
  PieChart as PieIcon, 
  BarChart as BarIcon, 
  TrendingUp, 
  Target, 
  BrainCircuit,
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalysisPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ income: 0, expenses: 0, balance: 0, categories: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSummary = async () => {
      const now = new Date();
      const summary = await transactionService.getMonthlySummary(user.uid, now.getMonth(), now.getFullYear());
      setData(summary);
      setLoading(false);
    };
    fetchSummary();
  }, [user]);

  const categoryEntries = Object.entries(data.categories || {}).sort((a, b) => b[1] - a[1]);
  const totalExpenses = data.expenses || 1; // Avoid divide by zero

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-manrope font-bold text-on-surface tracking-tight mb-2">Analysis</h1>
        <p className="text-on-surface-variant font-medium">Deep insights into your financial behavior.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending breakdown */}
        <div className="glass-card p-10 border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-manrope font-bold text-on-surface">Categories</h2>
            <PieIcon className="text-primary" size={24} />
          </div>

          {categoryEntries.length === 0 ? (
            <div className="p-20 text-center text-on-surface-variant italic font-medium">
              No expense data recorded this month.
            </div>
          ) : (
            <div className="space-y-8">
              {categoryEntries.map(([cat, amount], idx) => {
                const percentage = (amount / totalExpenses) * 100;
                return (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: idx * 0.1, duration: 1 }}
                    key={cat} 
                    className="space-y-3"
                  >
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-on-surface uppercase tracking-widest">{cat}</span>
                      <span className="text-on-surface-variant">${amount.toLocaleString()} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-surface-lowest rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Insights (Mocked as requested) */}
        <div className="space-y-8">
          <div className="glass-card p-10 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
              <BrainCircuit size={80} />
            </div>
            
            <div className="flex items-center gap-3 text-primary mb-6">
              <Zap size={20} className="fill-current" />
              <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Smart Insights</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Smart Saving Detected</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">You've spent 15% less on "Entertainment" compared to last month. Way to go!</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-tertiary" />
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Subscription Alert</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">Found 3 recurring payments this week. Consider reviewing unused subscriptions.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Target size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Wealth Milestone</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">You are on track to reach your $500 savings target by the end of the month.</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-10 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold text-primary tracking-widest uppercase">
              Analyze Full Trends
            </button>
          </div>

          <div className="glass-card p-8 border border-white/5 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-surface-highest flex items-center justify-center text-primary border border-white/5">
              <BarIcon size={32} />
            </div>
            <div>
              <p className="font-bold text-on-surface tracking-tight">Spending Forecast</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Predicted expenses for next week: ~$240 based on your history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
