'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { Building, Plus, Loader2, AlertCircle, LogOut } from 'lucide-react';

interface OrgMember {
  org_id: string;
  organisations: {
    id: string;
    name: string;
  };
}

export default function OrgSelectionPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<OrgMember[]>([]);
  const [newOrgName, setNewOrgName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const checkUserAndFetchOrgs = async () => {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('org_members')
          .select('org_id, organisations(id, name)')
          .eq('user_id', user.id);

        if (fetchError) throw fetchError;
        setOrgs((data as any) || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch organizations.');
      } finally {
        setIsFetching(false);
      }
    };

    checkUserAndFetchOrgs();
  }, [router]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated.');

      // 1. Create organisation
      const { data: orgData, error: orgError } = await supabase
        .from('organisations')
        .insert({ name: newOrgName })
        .select()
        .single();

      if (orgError) throw orgError;

      // 2. Create org membership
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          org_id: orgData.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOrg = (orgId: string) => {
    // Set active organization context if needed, then route
    router.push('/dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
            ORGANISATION_MANAGER_v1.0
          </div>
          <button 
            onClick={handleLogout}
            className="text-white/40 hover:text-white transition-colors"
            title="Terminate Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="font-display font-bold text-xl tracking-tight text-white mb-2">
              RECRUITER-X
            </h2>
            <p className="text-white/40 text-xs uppercase tracking-wider">
              Establish tenant scopes for candidate pipelines
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-xs leading-relaxed">{error}</div>
            </div>
          )}

          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#0000FF]" />
              <span className="text-xs text-white/30 uppercase tracking-widest">Querying organizations...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Existing Orgs list */}
              {orgs.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/60 uppercase block">
                    Select Active Tenant
                  </label>
                  <div className="space-y-2">
                    {orgs.map((o) => (
                      <button
                        key={o.org_id}
                        onClick={() => handleSelectOrg(o.org_id)}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-white/10 bg-[#070716] hover:border-[#0000FF] transition-all group font-bold text-xs active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="w-4 h-4 text-white/40 group-hover:text-[#0000FF] transition-colors" />
                          <span className="text-white/80 group-hover:text-white">{o.organisations?.name || 'Unnamed Org'}</span>
                        </div>
                        <span className="text-[10px] text-white/20 uppercase group-hover:text-[#0000FF] transition-colors">Access Panel &rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create new Org Form */}
              <form onSubmit={handleCreateOrg} className="space-y-4">
                <label className="text-xs font-bold text-white/60 uppercase block">
                  Initialize New Organization
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="Enter Organization Name"
                    className="w-full bg-[#070716] border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#0000FF] focus:ring-1 focus:ring-[#0000FF] transition-all text-xs"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-transparent border border-[#0000FF] hover:bg-[#0000FF]/10 text-white rounded-lg py-2.5 font-bold transition-all text-xs flex items-center justify-center gap-2 select-none active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Initializing Workspace...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Workspace</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
