
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, Headphones, Radio, CheckCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import GradientText from './GlitchText';
import { loginUser, registerUser, loginWithGoogle, resendConfirmation } from '../services/supabase';

interface AuthProps {
  onLogin: () => void;
  onCancel: () => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Auth: React.FC<AuthProps> = ({ onLogin, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  
  // New State for Role Selection
  const [role, setRole] = useState<'artist' | 'supervisor'>('artist');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setShowResend(false);
    
    // Trim email to avoid "Invalid login credentials" due to accidental spaces
    const cleanEmail = formData.email.trim();
    const cleanPassword = formData.password;

    try {
      if (isSignUp) {
        const { data } = await registerUser(cleanEmail, cleanPassword, formData.name, role);
        if (data.user && !data.session) {
          // User created but email not verified
          setSuccessMessage("Account created! Please check your email to confirm your address before logging in.");
          setIsSignUp(false);
        } else {
          onLogin();
        }
      } else {
        await loginUser(cleanEmail, cleanPassword);
        onLogin(); 
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('Email not confirmed')) {
        setError("Email not verified. Please check your inbox/spam folder.");
        setShowResend(true);
      } else if (err.message.includes('Invalid login credentials')) {
        setError("Invalid email or password. Please check for typos or Sign Up if you don't have an account.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email) return;
    setIsLoading(true);
    try {
      await resendConfirmation(formData.email);
      setSuccessMessage(`Confirmation email resent to ${formData.email}. Check your inbox.`);
      setError(null);
      setShowResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      // NOTE: OAuth triggers a redirect, so execution stops here in most cases.
    } catch (err: any) {
      console.error(err);
      setError("Google Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onCancel} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#1a1b3b]/90 border border-white/10 p-8 md:p-10 shadow-2xl shadow-[#ccff00]/10 overflow-hidden rounded-xl"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ccff00] rounded-full blur-[50px] opacity-10" />
        
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <GradientText text={isSignUp ? "CREATE ACCOUNT" : "WELCOME BACK"} className="text-2xl md:text-3xl font-heading mb-2" />
          <p className="text-white/50 text-sm font-mono">
            {isSignUp ? "Join the SyncMaster Network" : "Log in to your dashboard"}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col gap-2"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs text-red-200">{error}</p>
            </div>
            {showResend && (
              <button 
                onClick={handleResend}
                disabled={isLoading}
                className="text-[10px] uppercase font-bold tracking-widest bg-red-500/20 hover:bg-red-500/30 text-white py-1 px-2 rounded-xl flex items-center justify-center gap-2 self-end transition-colors"
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}

        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-[#ccff00] shrink-0" />
            <p className="text-xs text-[#ccff00]">{successMessage}</p>
          </motion.div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white text-black font-bold py-3 mb-6 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors rounded-xl"
        >
          <GoogleIcon />
          <span className="text-sm uppercase tracking-widest">Continue with Google</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-white/30 uppercase tracking-widest">Or</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection (Only on Sign Up) */}
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                onClick={() => setRole('artist')}
                className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${role === 'artist' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-black/20 border-white/10 text-white/50 hover:bg-white/5'}`}
              >
                <Headphones className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-widest">Artist</span>
              </div>
              <div 
                onClick={() => setRole('supervisor')}
                className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${role === 'supervisor' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-black/20 border-white/10 text-white/50 hover:bg-white/5'}`}
              >
                <Radio className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-widest text-center">Supervisor</span>
              </div>
            </div>
          )}

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">
                {role === 'artist' ? 'Artist / Band Name' : 'Supervisor / Agency Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  required
                  autoComplete="name"
                  className="w-full bg-black/40 border border-white/10 px-10 py-3 text-sm text-white focus:border-[#ccff00] outline-none transition-colors rounded-xl"
                  placeholder={role === 'artist' ? "e.g. Neon Voyager" : "e.g. HBO Music"}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="email" 
                required
                autoComplete="email"
                className="w-full bg-black/40 border border-white/10 px-10 py-3 text-sm text-white focus:border-[#ccff00] outline-none transition-colors rounded-xl"
                placeholder="email@domain.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-[#ccff00]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full bg-black/40 border border-white/10 px-10 py-3 text-sm text-white focus:border-[#ccff00] outline-none transition-colors rounded-xl"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ccff00] text-black font-bold uppercase tracking-widest py-3 mt-6 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden rounded-xl"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? 'Processing...' : (isSignUp ? `Initialize ${role === 'artist' ? 'Artist' : 'Supervisor'}` : 'Access Dashboard')}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </span>
            <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMessage(null); }}
            className="text-xs text-white/40 hover:text-[#ccff00] transition-colors uppercase tracking-widest border-b border-transparent hover:border-[#ccff00]"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need access? Join Now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
