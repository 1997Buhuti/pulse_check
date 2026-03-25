import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Mail, Lock, User, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, user, loading: authLoading, error } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/');
    } catch (err) {
      console.error("Auth Fail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google Auth Fail:", err);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginWithEmail('demo@financeflow.com', 'password123');
      navigate('/');
    } catch (err) {
      console.error("Demo Login Fail:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-indigo-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] mb-4"
          >
            <Wallet className="text-white" size={32} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-1 font-display text-white">FINANCEFLOW</h1>
          <p className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Kinetic Liquid Finance Tracker</p>
        </div>

        <div className="glass-card p-10 space-y-8 bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">{isRegistering ? 'Create Account' : 'Welcome back'}</h2>
            <p className="text-white/50 text-sm">
              {isRegistering ? 'Start your journey to financial freedom' : 'Sign in to manage your wealth'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe" 
                    required={isRegistering}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-white/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@financeflow.com" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-white/20"
                />
              </div>
            </div>

            {error && <p className="text-rose-400 text-[11px] font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold tracking-tight shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
            >
              {loading ? 'PROCESSING...' : (isRegistering ? 'GET STARTED' : 'ENTER FLOW')}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-white/10" />
            <span className="relative z-10 bg-[#0b1326] px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">secure gateway</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold text-white text-sm tracking-tight group"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            </div>
            CONTINUE WITH GOOGLE
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white font-bold text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
          >
            TRY DEMO (BACKUP LOGIN)
          </button>

          <div className="pt-2 flex flex-col items-center gap-4">
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
            <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-widest font-black">
              <TrendingUp size={12} className="text-emerald-500" />
              <span>Smart Financial Tracking</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
