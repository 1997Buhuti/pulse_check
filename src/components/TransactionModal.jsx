import React, { useState } from 'react';
import { X, Plus, Minus, Calendar, Tag, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Travel', 'Other'
];

const TransactionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [type, setType] = useState(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-lg overflow-hidden relative border border-white/10 shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-manrope font-bold text-primary">
                  {initialData ? 'Edit Transaction' : 'New Transaction'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Toggle */}
                <div className="flex p-1 bg-surface-lowest rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold ${
                      type === 'expense' ? 'bg-tertiary-container text-white shadow-lg' : 'text-on-surface-variant'
                    }`}
                  >
                    <Minus size={18} /> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold ${
                      type === 'income' ? 'bg-secondary-container text-white shadow-lg' : 'text-on-surface-variant'
                    }`}
                  >
                    <Plus size={18} /> Income
                  </button>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-manrope font-bold text-on-surface-variant">$</span>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field w-full pl-12 text-3xl font-manrope font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1 flex items-center gap-2">
                      <Tag size={12} /> Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input-field w-full !py-3 appearance-none font-semibold text-sm"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1 flex items-center gap-2">
                      <Calendar size={12} /> Date
                    </label>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-field w-full !py-3 text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1 flex items-center gap-2">
                    <FileText size={12} /> Note
                  </label>
                  <input
                    type="text"
                    placeholder="What was this for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-5 text-lg mt-4 shadow-[0_10px_40px_rgba(192,193,255,0.2)]">
                  Save Transaction
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
