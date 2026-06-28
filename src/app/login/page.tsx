'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Check if user belongs to an organization.
      // If not, redirect to organization selection page.
      const user = data.user;
      if (user) {
        const { data: orgs, error: orgError } = await supabase
          .from('org_members')
          .select('org_id')
          .eq('user_id', user.id);

        if (orgError || !orgs || orgs.length === 0) {
          router.push('/org-selection');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center px-4 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/login.jpeg')" }}
    >
      {/* Dark overlay to ensure contrast */}
      <div className="absolute inset-0 bg-[#070716]/45 backdrop-blur-[1px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-[420px] rounded-[32px] bg-[#0d0c22]/45 backdrop-blur-xl text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 z-10 p-8 flex flex-col items-center">
        
        {/* Animated Target/Concentric Dotted Icon */}
        <div className="mb-6 flex justify-center">
          <svg className="w-12 h-12 text-white/90 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="font-sans font-medium text-3xl tracking-tight text-white mb-2.5">
            Welcome back!
          </h2>
          <p className="text-white/60 text-xs px-2 leading-relaxed">
            Sign in to access your talent intelligence platform, campaigns, and candidate pipelines
          </p>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="text-xs leading-relaxed">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex justify-between items-center text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-white/60 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 bg-white/5 text-white focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer accent-white"
              />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-white/60 hover:text-white font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-white/90 disabled:bg-white/50 text-black rounded-full py-3.5 font-semibold transition-all text-xs flex items-center justify-center gap-2 select-none active:scale-[0.98] shadow-lg shadow-black/10 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Establishing Session...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-[#0f0e24] px-3 text-white/40">Or</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white/5 hover:bg-white/10 disabled:bg-transparent text-white border border-white/10 rounded-full py-3 font-medium transition-all text-xs flex items-center justify-center gap-2.5 select-none active:scale-[0.98]"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Sign In with Google</span>
        </button>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-white/40">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-white hover:underline font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
