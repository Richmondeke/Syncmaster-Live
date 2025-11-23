/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import GradientText from './GlitchText';
import { loginUser, registerUser } from '../services/firebase';

interface AuthProps {
  onLogin: () => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        await registerUser(formData.email, formData.password, formData.name);
      } else {
        await loginUser(formData.email, formData.password);
      }
      onLogin(); // App.tsx listener will also catch this, but calling this ensures UI transition starts
    } catch (err: any) {
      console.error(err);
      let msg = "Authentication failed. Please try again.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      if (err.code === 'auth/invalid-api-key') msg = "System Configuration Error: Invalid API Key.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onCancel} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#1a1b3b]/90 border border-white/10 p-8 md:p-10 shadow-2xl shadow-purple-500/10 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4fb7b3] to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#637ab9] rounded-full blur-[50px] opacity-20" />
        
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <GradientText text={isSignUp ? "ARTIST ACCESS" : "SYNC DASHBOARD"} className="text-2xl md:text-3xl font-heading mb-2" />
          <p className="text-white/50 text-sm font-mono">
            {isSignUp ? "Create your professional profile" : "Log in to view briefs"}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs text-red-200">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Artist / Composer Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-black/40 border border-white/10 px-10 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none transition-colors"
                  placeholder="e.g. Neon Voyager"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="email" 
                required
                className="w-full bg-black/40 border border-white/10 px-10 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none transition-colors"
                placeholder="artist@label.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-[#a8fbd3]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="password" 
                required
                className="w-full bg-black/40 border border-white/10 px-10 py-3 text-sm text-white focus:border-[#4fb7b3] outline-none transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4fb7b3] text-black font-bold uppercase tracking-widest py-3 mt-6 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? 'Processing...' : (isSignUp ? 'Initialize' : 'Access Platform')}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </span>
            <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-xs text-white/40 hover:text-[#a8fbd3] transition-colors uppercase tracking-widest border-b border-transparent hover:border-[#a8fbd3]"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need access? Join Now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;