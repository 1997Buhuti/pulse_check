import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, PieChart, User, LogOut, Wallet, Plus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={24} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Receipt size={24} />, label: 'Transactions', path: '/transactions' },
    { icon: <PieChart size={24} />, label: 'Analysis', path: '/analysis' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-inter">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-surface-low border-r border-outline-variant/5 flex-col fixed h-full">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)]">
            <Wallet className="text-background" size={24} />
          </div>
          <div>
            <h1 className="font-manrope font-bold text-xl leading-tight tracking-tight text-primary">Finance</h1>
            <p className="font-manrope text-xs text-on-surface-variant font-medium uppercase tracking-[0.2em]">Flow</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-surface-container text-primary shadow-[0_4px_20px_rgba(0,0,0,0.2)] ring-1 ring-white/5' 
                    : 'text-on-surface-variant hover:bg-surface-container/40 hover:text-on-surface'
                }`}
              >
                <span className={isActive ? 'text-primary' : 'text-on-surface-variant'}>{item.icon}</span>
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill-desktop"
                    className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#c0c1ff]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-5 rounded-[2rem] bg-surface-container/30 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-primary/20" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-lg">
                  <User size={20} />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.displayName}</p>
                <p className="text-[10px] text-on-surface-variant truncate uppercase tracking-wider">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-bright/50 hover:bg-surface-bright transition-all text-xs font-bold text-on-surface-variant hover:text-on-surface"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pb-32 lg:pb-8 h-screen overflow-y-auto no-scrollbar">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Floating Dock (Glassmorphism) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <div className="glass-card flex items-center gap-2 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-2xl">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative p-4 rounded-2xl transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.icon}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill-mobile"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#c0c1ff]"
                  />
                )}
              </button>
            );
          })}
          
          <div className="w-[1px] h-8 bg-white/10 mx-1" />
          
          <button 
            onClick={() => setIsAddMenuOpen(true)}
            className="p-4 bg-gradient-primary rounded-2xl text-background shadow-lg active:scale-90 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
