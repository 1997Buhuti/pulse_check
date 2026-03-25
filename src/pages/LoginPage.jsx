import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';

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
      // Redirect login won't navigate immediately here, it will redirect the whole page
    } catch (err) {
      console.error("Google Auth Fail:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(135,173,255,0.4)] mb-4"
          >
            <Heart className="text-white fill-white" size={28} />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tighter mb-1 italic">PULSECHECK</h1>
          <p className="text-on-surface-variant font-medium tracking-wide uppercase text-[10px]">Violet Momentum Dashboard</p>
        </div>

        <div className="glass-card p-8 space-y-6 bg-surface-container/40">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{isRegistering ? 'Create Account' : 'Welcome back'}</h2>
            <p className="text-on-surface-variant text-xs">
              {isRegistering ? 'Join your team and start sharing kudos' : 'Sign in to access your team dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider ml-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Carter" 
                    required
                    className="w-full bg-surface-container/60 border border-outline-variant/20 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@pulsecheck.com" 
                  required
                  className="w-full bg-surface-container/60 border border-outline-variant/20 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full bg-surface-container/60 border border-outline-variant/20 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            {error && <p className="text-error text-[10px] font-bold mt-1 ml-1">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-primary text-on-primary font-black tracking-tight shadow-[0_4px_20px_rgba(135,173,255,0.3)] hover:shadow-[0_8px_30px_rgba(135,173,255,0.5)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : (isRegistering ? 'CREATE ACCOUNT' : 'SIGN IN')}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-x-0 h-px bg-outline-variant/10" />
            <span className="relative z-10 bg-surface-container px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl border border-outline-variant/20 hover:bg-surface-container transition-all font-bold text-sm tracking-tight"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            </div>
            CONTINUE WITH GOOGLE
          </button>

          <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary hover:underline italic"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
            <Activity size={10} className="text-secondary" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
