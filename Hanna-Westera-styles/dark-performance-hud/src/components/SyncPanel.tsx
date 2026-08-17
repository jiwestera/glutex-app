import React, { useState } from 'react';
import { Cloud, CloudOff, RefreshCw, LogOut, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import { isSyncAvailable, SyncUser } from '../utils/firebaseSync';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface SyncPanelProps {
  user: SyncUser | null;
  status: SyncStatus;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onManualSync: () => void;
}

export const SyncPanel: React.FC<SyncPanelProps> = ({ user, status, onSignIn, onSignUp, onSignOut, onManualSync }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSyncAvailable()) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center space-x-2">
          <CloudOff className="w-3.5 h-3.5 text-stone-700" />
          <span>Cross-Device Sync</span>
        </label>
        <p className="text-[11px] text-stone-500 leading-snug">
          Cloud sync isn't set up for this build. Your data stays local to this device only.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter both an email and a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await onSignIn(email.trim(), password);
      } else {
        await onSignUp(email.trim(), password);
      }
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center space-x-2">
        <Cloud className="w-3.5 h-3.5 text-stone-700" />
        <span>Cross-Device Sync</span>
      </label>

      {user ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-stone-50 gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-900 truncate">{user.email}</p>
              <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                {status === 'syncing' && (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Syncing...</span>
                  </>
                )}
                {status === 'synced' && (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Synced</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    <span>Sync error — try again</span>
                  </>
                )}
                {status === 'idle' && <span>Connected</span>}
              </p>
            </div>
            <button
              type="button"
              onClick={onManualSync}
              className="p-2 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer shrink-0"
              title="Sync now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status === 'syncing' ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full py-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <p className="text-[11px] text-stone-500 leading-snug">
            Sign in to back up your data and pick it up on another device. Optional — everything works fine locally without this.
          </p>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-[11px] flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6+ characters)"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In & Sync' : 'Create Account & Sync'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className="w-full text-center text-[11px] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            {mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </button>
        </form>
      )}
    </div>
  );
};
