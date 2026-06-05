import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Activity, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 rounded-3xl z-10 border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Enter your credentials to continue your arc.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" placeholder="Email address" required
                className="w-full bg-surface/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" placeholder="Password" required
                className="w-full bg-surface/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Platform'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account? <Link to="/signup" className="text-primary hover:text-white transition-colors">Initialize Arc</Link>
        </p>
      </motion.div>
    </div>
  );
}
