import React, { useState } from 'react';
import { authClient } from '../utils/auth-client';
import { Shield } from 'lucide-react';

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
        setError(error.message || 'Login failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4 text-foreground selection:bg-accent/20">
      <div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-border bg-surface shadow-strong">
        <div className="border-b border-border p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Shield className="text-accent" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">CSEA Control</h1>
          <p className="mt-1 text-sm text-foreground-muted">Sign in to the administrative panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
              placeholder="admin@csea.kitsw.ac.in"
            />
          </div>
          
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-md bg-accent py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
