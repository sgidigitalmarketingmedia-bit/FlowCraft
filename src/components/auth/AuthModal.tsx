import React, { useState } from 'react';
import { Lock, Mail, User, Shield, CheckCircle2, X, ArrowRight, Sparkles } from 'lucide-react';
import { AuthUser, UserRole } from '../../types/builder';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('stephen.gershen@gmail.com');
  const [password, setPassword] = useState('SecurePass2026!');
  const [name, setName] = useState('Stephen Gershen');
  const [role, setRole] = useState<UserRole>('Product Manager');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid work email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: `user_${Date.now()}`,
        email,
        name: mode === 'signup' ? name : (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())),
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        token: `jwt_session_${Math.random().toString(36).substring(2)}`,
      };

      localStorage.setItem('flowcraft_auth_session', JSON.stringify(user));
      setIsSubmitting(false);
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  const handleQuickDemoLogin = (demoRole: UserRole, demoName: string, demoEmail: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: `user_${demoRole.toLowerCase().replace(/\s+/g, '_')}`,
        email: demoEmail,
        name: demoName,
        role: demoRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(demoEmail)}`,
        token: `jwt_session_${Date.now()}`,
      };
      localStorage.setItem('flowcraft_auth_session', JSON.stringify(user));
      setIsSubmitting(false);
      onLoginSuccess(user);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl text-slate-100">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">FlowCraft Studio Access</h3>
              <p className="text-xs text-slate-400">Enterprise Workspace Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Testing Mode Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between gap-3 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-semibold">Testing Mode Active:</span>
            <span className="text-amber-200/80 hidden sm:inline">Sign up is disabled while testing flow.</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Product Manager', 'Stephen Gershen', 'stephen.gershen@gmail.com')}
            className="rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-200 transition-colors"
          >
            Enter Studio (Bypass)
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Stephen Gershen"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Workspace Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Product Manager">Product Manager (Journey Flow & Specs)</option>
              <option value="Lead UX Designer">Lead UX Designer (Canvas Layout & Style)</option>
              <option value="Staff Frontend Engineer">Staff Frontend Engineer (Code & Schemas)</option>
            </select>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              disabled={true}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-75"
              title="Disabled during testing"
            >
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'} (Disabled for Testing)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Product Manager', 'Stephen Gershen', 'stephen.gershen@gmail.com')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all"
            >
              <span>Continue & Enter Studio (Testing Bypass)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Quick Demo Logins for Testing */}
          <div className="pt-2 border-t border-slate-800">
            <span className="block text-[11px] font-medium text-slate-400 mb-2">
              Quick 1-Click Fast Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Product Manager', 'Stephen Gershen', 'stephen.gershen@gmail.com')}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-left hover:bg-slate-800 hover:border-slate-600 transition-colors text-xs"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">Stephen Gershen</div>
                  <div className="text-[10px] text-slate-400 truncate">Product Manager</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Staff Frontend Engineer', 'Elena Rostova', 'elena.rostova@techcorp.io')}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-left hover:bg-slate-800 hover:border-slate-600 transition-colors text-xs"
              >
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">Elena Rostova</div>
                  <div className="text-[10px] text-slate-400 truncate">Frontend Lead</div>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
