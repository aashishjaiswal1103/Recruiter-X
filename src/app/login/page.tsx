'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { KeyRound, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-screen bg-[#070716] flex flex-col justify-center items-center px-4 font-mono text-sm relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0000FF]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-md rounded-2xl bg-[#090916] text-white shadow-2xl overflow-hidden border border-white/5 z-10">
        
        {/* Console Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#121226]">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="text-white/40 text-xs font-data select-none tracking-wider uppercase">
            SECURE_LOGIN_v1.0
          </div>
          <div className="w-12" />
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="font-display font-bold text-xl tracking-tight text-white mb-2">
              RECRUITER-X
            </h2>
            <p className="text-white/40 text-xs uppercase tracking-wider">
              Enter credentials to establish terminal session
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-xs leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 block uppercase">
                Email Address
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
                  placeholder="name@company.com"
                  className="w-full bg-[#070716] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#0000FF] focus:ring-1 focus:ring-[#0000FF] transition-all text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white/60 uppercase">
                  Terminal Key (Password)
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#070716] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#0000FF] focus:ring-1 focus:ring-[#0000FF] transition-all text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0000FF] hover:bg-[#0000CC] disabled:bg-[#0000FF]/50 text-white rounded-lg py-3 font-bold transition-all text-xs flex items-center justify-center gap-2 select-none border border-[#0000FF]/30 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Establishing Session...</span>
                </>
              ) : (
                <span>Initialize Session</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/40">
            <span>New operator? </span>
            <Link href="/signup" className="text-[#0000FF] hover:underline font-bold">
              Register key credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
