import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, MessageSquare, LogOut, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <MessageSquare size={20} />, label: 'Feed', path: '/' },
    { icon: <Users size={20} />, label: 'Leaderboard', path: '/leaderboard' },
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-low border-r border-outline-variant/10 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(135,173,255,0.3)]">
            <Heart className="text-white fill-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Pulse</h1>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Check</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-surface-container text-primary border border-primary/20 shadow-[0_0_10px_rgba(135,173,255,0.05)]' 
                    : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1 h-4 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/10 mb-4">
            <div className="flex items-center gap-3 mb-3">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-primary/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-high border border-primary/20 flex items-center justify-center text-sm shadow-inner">
                  👤
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.displayName}</p>
                <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-surface-high/50 hover:bg-surface-high transition-colors text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
