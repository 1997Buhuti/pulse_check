import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import TransactionModal from '../components/TransactionModal';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = transactionService.subscribeToTransactions(user.uid, (data) => {
      setTransactions(data.slice(0, 5)); // Only show last 5
      
      const sums = data.reduce((acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        else acc.expenses += curr.amount;
        acc.balance = acc.income - acc.expenses;
        return acc;
      }, { income: 0, expenses: 0, balance: 0 });
      
      setSummary(sums);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTransaction = async (data) => {
    await transactionService.addTransaction(user.uid, data);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-manrope font-bold tracking-tight text-on-surface mb-2">
            Hey, {user?.displayName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">Here's what's happening with your money.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-3 px-8 self-start md:self-auto"
        >
          <Plus size={20} strokeWidth={3} /> Add Record
        </button>
      </div>

      {/* Hero Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative group">
          <div className="absolute -inset-1 bg-gradient-primary rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="glass-card relative p-10 bg-surface-container/40 overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-[3] pointer-events-none">
              <Wallet size={120} />
            </div>
            <div className="mb-10 text-xs font-bold text-on-surface-variant uppercase tracking-[0.3em]">Total Balance</div>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl md:text-7xl font-manrope font-bold tracking-tighter text-primary">
                ${summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold animate-pulse">
                <TrendingUp size={14} /> +2.4%
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12 pt-10 border-t border-white/5">
              <div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-3">
                  <ArrowDownLeft size={14} className="text-secondary" /> Monthly Income
                </div>
                <div className="text-2xl font-manrope font-bold text-on-surface">
                  ${summary.income.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-3">
                  <ArrowUpRight size={14} className="text-tertiary" /> Total Spending
                </div>
                <div className="text-2xl font-manrope font-bold text-on-surface">
                  ${summary.expenses.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Progress Card */}
        <div className="glass-card p-10 flex flex-col justify-between border border-white/5">
          <div>
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.3em] mb-8">Monthly Budget</div>
            <div className="text-4xl font-manrope font-bold text-on-surface mb-2">72% Used</div>
            <p className="text-sm text-on-surface-variant font-medium mb-8">$1,240 of $1,800 spent</p>
            
            <div className="w-full h-3 bg-surface-lowest rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-primary rounded-full shadow-[0_0_15px_rgba(192,193,255,0.4)]"
              />
            </div>
          </div>
          
          <button className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-sm font-bold text-on-surface-variant hover:text-on-surface">
            Adjust Budget <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-manrope font-bold text-on-surface">Recent Activity</h2>
          <button className="text-primary font-bold text-sm tracking-wide hover:underline">View All History</button>
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="glass-card p-12 text-center border-dashed border-2 border-white/5">
              <p className="text-on-surface-variant font-medium mb-6">No records found. Start tracking your wealth today!</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Plus size={18} /> Add Your First Record
              </button>
            </div>
          ) : (
            transactions.map((t, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={t.id}
                className="glass-card p-6 flex items-center justify-between glass-card-hover group border border-white/5"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110 ${
                    t.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'
                  }`}>
                    {t.type === 'income' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{t.description || t.category}</h4>
                    <div className="flex items-center gap-3 text-xs font-semibold text-on-surface-variant uppercase tracking-widest mt-1">
                      <span>{t.category}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-manrope font-bold ${
                  t.type === 'income' ? 'text-secondary' : 'text-on-surface'
                }`}>
                  {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddTransaction}
      />
    </div>
  );
};

export default DashboardPage;
