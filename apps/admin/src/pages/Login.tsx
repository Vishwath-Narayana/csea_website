import React, { useState } from 'react';
import { authClient } from '../utils/auth-client';
import { Shield, ArrowRight, Activity, Database, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Unable to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas text-foreground selection:bg-accent/20">
      {/* LEFT: Branding / Imagery (Hidden on small screens) */}
      <div className="hidden w-1/2 flex-col justify-between bg-surface border-r border-border p-12 lg:flex relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/20">
            <Shield size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight">CSEA Control</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-foreground">
            Manage the <span className="text-accent">platform</span> with precision.
          </h1>
          <p className="mb-10 text-lg text-foreground-muted">
            Access administrative controls, moderate content, and oversee the CSEA digital ecosystem securely.
          </p>
          
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface-secondary/50 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-accent shadow-sm border border-border">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Real-time Metrics</h3>
                <p className="text-sm text-foreground-muted">Monitor platform activity and engagement</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface-secondary/50 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-accent shadow-sm border border-border">
                <Database size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Content Management</h3>
                <p className="text-sm text-foreground-muted">Publish events, journal entries, and projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-foreground-muted font-medium">
          <Lock size={14} className="text-accent/80" /> 
          <span>Secure internal access only. Activity is monitored.</span>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 relative">
        <div className="w-full max-w-[420px]">
          {/* Mobile Header (Hidden on large screens) */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/20">
              <Shield size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight">CSEA Control</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Welcome back</h2>
            <p className="mt-2 text-sm text-foreground-muted sm:text-base">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 animate-in fade-in slide-in-from-top-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                  <span className="text-xs font-bold">!</span>
                </div>
                <p>{error}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-border bg-surface-secondary/50 px-4 text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-surface focus:ring-1 focus:ring-accent"
                placeholder="admin@csea.kitsw.ac.in"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
              </div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-border bg-surface-secondary/50 px-4 text-sm text-foreground outline-none transition-all focus:border-accent focus:bg-surface focus:ring-1 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white transition-all hover:bg-accent/90 disabled:opacity-50 disabled:hover:bg-accent shadow-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-foreground-muted lg:hidden">
            <p className="flex items-center justify-center gap-1">
              <Lock size={12} className="text-accent/80" /> 
              Secure internal access only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
