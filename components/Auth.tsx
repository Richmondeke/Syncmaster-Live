
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

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'artist' | 'supervisor'>('artist');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error("Full Name is required.");
        
        // Safely capture response to avoid 'Cannot read properties of undefined'
        const response = await registerUser(email, password, name, role);
        const user = response?.user;
        
        if (user) {
          setSuccessMessage(`Account created! Please check ${email} to confirm your account before logging in.`);
          // Don't auto-login on signup if email confirmation is required
          setIsSignUp(false);
        }
      } else {
        const response = await loginUser(email, password);
        if (response?.user) {
           onLogin();
        }
      }
    } catch (err: any) {
      console.error("Auth process error:", err);
      let msg = err.message || "Authentication failed.";
      
      // Handle rate limit / security errors
      if (msg.toLowerCase().includes("security purposes") || msg.toLowerCase().includes("seconds")) {
        msg = "For security, please wait 60 seconds before trying again.";
      } else if (msg.includes("Invalid login credentials")) {
        msg = "Invalid email or password.";
      }
      
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      setError(null);
      await resendConfirmation(email);
      setSuccessMessage("Confirmation email resent. Check your inbox.");
    } catch (err: any) {
       let msg = err.message;
       if (msg.toLowerCase().includes("security purposes")) {
         msg = "Please wait a moment before requesting another email.";
       }
       setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-[#1a1b3b] border border-white/10 p-8 rounded-xl shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onCancel} 
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
           <div className="flex items-center justify-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center">
                <span className="font-heading font-bold text-[#31326f] text-lg transform translate-y-[1px]">S</span>
             </div>
           </div>
           <GradientText text={isSignUp ? "JOIN SYNCMASTER" : "WELCOME BACK"} className="text-2xl font-bold" />
           <p className="text-white/40 text-xs uppercase tracking-widest mt-2">
             {isSignUp ? "Create your professional profile" : "Access your dashboard"}
           </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-200 text-sm items-start"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
               <p>{error}</p>
               {!isSignUp && (error.includes("Invalid") || error.includes("confirm")) && (
                  <button onClick={handleResend} className="text-xs underline mt-2 hover:text-white flex items-center gap-1">
                     <RefreshCw className="w-3 h-3" /> Resend Confirmation
                  </button>
               )}
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3 text-green-200 text-sm items-center"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p>{successMessage}</p>
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className="relative mb-4">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:border-[#ccff00] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div 
                  onClick={() => setRole('artist')}
                  className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'artist' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-black/20 border-white/10 text-white/50 hover:border-white/30'}`}
                >
                  <Headphones className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Artist</span>
                </div>
                <div 
                  onClick={() => setRole('supervisor')}
                  className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'supervisor' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-black/20 border-white/10 text-white/50 hover:border-white/30'}`}
                >
                  <Radio className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Supervisor</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:border-[#ccff00] outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder-white/30 focus:border-[#ccff00] outline-none transition-colors"
            />
            <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
               {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ccff00] text-black font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
               <>
                 {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
               </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-white/20">
           <div className="h-px bg-current flex-1" />
           <span className="text-[10px] uppercase font-bold">Or continue with</span>
           <div className="h-px bg-current flex-1" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMessage(null); }}
            className="text-xs text-white/50 hover:text-[#ccff00] uppercase tracking-widest font-bold transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Join Now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
