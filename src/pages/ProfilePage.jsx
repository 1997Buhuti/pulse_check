import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, Shield, CreditCard, Bell, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user } = useAuth();
  const [budget, setBudget] = useState('2000');
  const [savingsTarget, setSavingsTarget] = useState('500');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'userProfiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBudget(data.monthlyBudget || '2000');
        setSavingsTarget(data.savingsTarget || '500');
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'userProfiles', user.uid), {
        monthlyBudget: budget,
        savingsTarget: savingsTarget,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center gap-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-primary rounded-full blur opacity-20 group-hover:opacity-40 transition transition-1000"></div>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="relative w-32 h-32 rounded-full border-4 border-surface-container shadow-2xl" />
          ) : (
            <div className="relative w-32 h-32 rounded-full bg-surface-container flex items-center justify-center text-4xl border-4 border-surface-container">
              <User size={64} className="text-on-surface-variant" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-manrope font-bold text-on-surface tracking-tight mb-2">{user?.displayName || 'Finance User'}</h1>
          <p className="text-on-surface-variant font-medium text-lg">{user?.email}</p>
          <div className="flex gap-4 mt-6">
            <span className="px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-widest border border-secondary/20">PREMIUM MEMBER</span>
            <span className="px-4 py-1.5 bg-surface-bright text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-widest">EST. 2026</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Financial Settings */}
        <div className="glass-card p-10 space-y-8 border border-white/5">
          <div className="flex items-center gap-4 text-primary">
            <CreditCard size={28} />
            <h2 className="text-2xl font-manrope font-bold text-on-surface">Financial Targets</h2>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] px-1">Monthly Budget ($)</label>
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="input-field w-full text-xl font-bold font-manrope" 
                placeholder="2000"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] px-1">Savings Target ($)</label>
              <input 
                type="number" 
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(e.target.value)}
                className="input-field w-full text-xl font-bold font-manrope" 
                placeholder="500"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? 'Syncing...' : showSuccess ? <><CheckCircle size={20} /> Targets Updated</> : <><Save size={20} /> Update Parameters</>}
            </button>
          </form>
        </div>

        {/* Account Security */}
        <div className="glass-card p-10 space-y-8 border border-white/5">
          <div className="flex items-center gap-4 text-primary">
            <Shield size={28} />
            <h2 className="text-2xl font-manrope font-bold text-on-surface">Security & Privacy</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-surface-lowest border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Face ID / Touch ID</p>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Require biometrics for access</p>
              </div>
              <div className="w-12 h-6 bg-secondary/20 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-secondary rounded-full" />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-lowest border border-white/5 flex items-center justify-between opacity-50">
              <div>
                <p className="font-bold text-on-surface">Data Backup</p>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Automatic cloud backups</p>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant rounded-full" />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-lowest border border-white/5 flex items-center justify-between opacity-50">
              <div>
                <p className="font-bold text-on-surface">Push Notifications</p>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Alerts on heavy spending</p>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-10 glass-card bg-surface-lowest border-2 border-dashed border-white/5 text-center">
        <p className="text-on-surface-variant italic font-medium">FinanceFlow v1.0.0 — Your private financial ecosystem.</p>
      </div>
    </div>
  );
};

export default ProfilePage;
