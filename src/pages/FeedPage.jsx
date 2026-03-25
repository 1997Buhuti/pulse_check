import React, { useState } from 'react';
import { useKudos, useComments } from '../hooks/useKudos';
import { useAuth } from '../context/AuthContext';
import { Plus, MessageCircle, Heart, Star, Send, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KudoComments = ({ kudoId, user }) => {
  const comments = useComments(kudoId);
  const [newComment, setNewComment] = useState('');
  const { addComment } = useKudos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(kudoId, {
      text: newComment,
      userId: user.uid,
      userName: user.displayName || user.email.split('@')[0],
      userPhoto: user.photoURL || ''
    });
    setNewComment('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 pt-6 border-t border-outline-variant/10 space-y-4 overflow-hidden"
    >
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3 text-sm group">
            <div className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center text-[10px] overflow-hidden shrink-0 border border-outline-variant/10">
              {comment.userPhoto ? (
                <img src={comment.userPhoto} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>
            <div className="flex-1 bg-surface-low/50 rounded-2xl p-4 border border-outline-variant/5">
              <p className="font-black text-[10px] text-secondary mb-1 uppercase tracking-widest">{comment.userName}</p>
              <p className="text-on-surface/90 leading-relaxed">{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-xs text-on-surface-variant italic py-4">No comments yet. Be the first to react!</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3 pt-2">
        <input 
          type="text" 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the momentum..."
          className="flex-1 bg-surface-low border border-outline-variant/20 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
        />
        <button 
          type="submit" 
          disabled={!newComment.trim()}
          className="w-12 h-12 flex items-center justify-center bg-primary/20 text-primary rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-primary/20 disabled:hover:text-primary"
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
};

const FeedPage = () => {
  const { kudos, addKudo, deleteKudo, toggleLike } = useKudos();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [openCommentsId, setOpenCommentsId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage || !recipient) return;
    
    // Use user.displayName or fallback
    const senderName = user?.displayName || user?.email?.split('@')[0] || 'Anonymous';
    
    addKudo({
      from: senderName,
      fromId: user?.uid || 'anonymous',
      fromPhoto: user?.photoURL || '',
      to: recipient,
      message: newMessage,
      emoji: selectedEmoji,
    });
    setNewMessage('');
    setRecipient('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter">THE FEED</h2>
          <p className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">Real-time Momentum pulse</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          SEND KUDOS
        </button>
      </header>

      <div className="space-y-6">
        {kudos.map((kudo, index) => (
          <motion.div
            key={kudo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 flex gap-6"
          >
            <div className="text-4xl p-4 bg-surface-low rounded-2xl flex items-center justify-center border border-outline-variant/10 shadow-inner">
              {kudo.emoji}
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {kudo.fromPhoto ? (
                      <img src={kudo.fromPhoto} alt={kudo.from} className="w-5 h-5 rounded-full border border-primary/20" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-surface-high border border-primary/20 flex items-center justify-center text-[10px] shadow-inner">
                        👤
                      </div>
                    )}
                    <span className="text-primary font-black italic">{kudo.from.toUpperCase()}</span>
                    <Send size={12} className="text-on-surface-variant" />
                    <span className="text-secondary font-black italic">{kudo.to.toUpperCase()}</span>
                  </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                    {new Date(kudo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {user?.uid === kudo.fromId && (
                    <button 
                      onClick={() => deleteKudo(kudo.id)}
                      className="text-on-surface-variant hover:text-red-400 transition-colors p-1"
                      title="Delete Kudos"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-lg font-medium leading-relaxed text-on-surface/90">
                "{kudo.message}"
              </p>
              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={() => toggleLike(kudo.id, user?.uid, kudo)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    (kudo.likes || []).includes(user?.uid) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <Heart size={14} fill={(kudo.likes || []).includes(user?.uid) ? 'currentColor' : 'none'} /> 
                  {(kudo.likes || []).length}
                </button>
                <button 
                  onClick={() => setOpenCommentsId(openCommentsId === kudo.id ? null : kudo.id)}
                  className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full transition-all ${
                    openCommentsId === kudo.id 
                      ? 'bg-secondary text-white' 
                      : 'bg-surface-high text-secondary hover:bg-secondary hover:text-white shadow-sm'
                  }`}
                >
                  <MessageCircle size={14} /> 
                  <span className="flex items-center gap-1">
                    {kudo.commentCount || 0}
                    <span className="opacity-60 text-[10px] ml-0.5">·</span>
                    {openCommentsId === kudo.id ? 'CLOSE' : 'REPLY'}
                  </span>
                </button>
              </div>
              
              <AnimatePresence>
                {openCommentsId === kudo.id && (
                  <KudoComments kudoId={kudo.id} user={user} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-xl p-10 relative bg-surface-bright shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-primary/20"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black italic tracking-tighter mb-1">GIVE RECOGNITION</h3>
                <p className="text-on-surface-variant text-xs font-medium tracking-wide border-l-2 border-secondary pl-2 uppercase">Fuel the momentum of your team</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary tracking-widest uppercase">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Enter teammate name..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all text-on-surface"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary tracking-widest uppercase">The Message</label>
                  <textarea
                    rows={4}
                    placeholder="What did they do that was electric?..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-5 py-4 focus:outline-none focus:border-primary transition-all text-on-surface resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-secondary tracking-widest uppercase">Choose the Vibe</label>
                  <div className="flex gap-3">
                    {['🔥', '🚀', '⚡', '💎', '🎉', '🧠'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl transition-all ${
                          selectedEmoji === emoji 
                            ? 'bg-secondary/20 border-2 border-secondary scale-110' 
                            : 'bg-surface-low border border-outline-variant/10 grayscale hover:grayscale-0'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 mt-4"
                >
                  <Send size={20} /> SEND KUDOS
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedPage;
