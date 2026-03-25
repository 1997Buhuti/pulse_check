import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import TransactionModal from '../components/TransactionModal';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Edit3,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = transactionService.subscribeToTransactions(user.uid, (data) => {
      setTransactions(data);
      setFilteredTransactions(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let result = transactions;
    if (searchTerm) {
      result = result.filter(t => 
        (t.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.category?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }
    setFilteredTransactions(result);
  }, [searchTerm, filterType, transactions]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record forever?')) {
      await transactionService.deleteTransaction(id, user.uid);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingTransaction) {
      await transactionService.updateTransaction(editingTransaction.id, data, user.uid);
    } else {
      await transactionService.addTransaction(user.uid, data);
    }
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-manrope font-bold text-on-surface tracking-tight mb-2">History</h1>
          <p className="text-on-surface-variant font-medium">A complete record of your financial journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text" 
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 pr-4 !py-3 w-full md:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-12 pr-8 !py-3 appearance-none font-bold text-sm bg-surface-lowest text-on-surface"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border border-white/5">
        <div className="hidden md:grid grid-cols-5 p-6 border-b border-white/5 text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">
          <div className="col-span-2">Description / Category</div>
          <div>Date</div>
          <div>Amount</div>
          <div className="text-center">Actions</div>
        </div>
        
        <div className="divide-y divide-white/5">
          <AnimatePresence mode='popLayout'>
            {filteredTransactions.length === 0 ? (
              <div className="p-20 text-center text-on-surface-variant italic font-medium">
                No matching records found.
              </div>
            ) : (
              filteredTransactions.map((t, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={t.id} 
                  className="grid grid-cols-1 md:grid-cols-5 p-6 items-center gap-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="col-span-2 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      t.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'
                    }`}>
                      {t.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{t.description || t.category}</div>
                      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">{t.category}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm font-semibold text-on-surface-variant flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  
                  <div className={`text-lg font-manrope font-bold ${
                    t.type === 'income' ? 'text-secondary' : 'text-on-surface'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(t)}
                      className="p-3 bg-surface-lowest text-on-surface-variant hover:text-primary hover:bg-surface-high rounded-xl transition-all active:scale-90"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="p-3 bg-surface-lowest text-on-surface-variant hover:text-tertiary hover:bg-surface-high rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex items-center justify-between pb-10">
        <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">
          Showing {filteredTransactions.length} of {transactions.length} total records
        </p>
        <div className="flex items-center gap-2">
          <button className="p-3 bg-surface-lowest rounded-xl text-on-surface-variant hover:text-on-surface disabled:opacity-30" disabled>
            <ChevronLeft size={20} />
          </button>
          <button className="p-3 bg-surface-lowest rounded-xl text-on-surface-variant hover:text-on-surface disabled:opacity-30" disabled>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }} 
        onSave={handleSave}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
