import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { CrownIcon } from '../common/MenuIcons';
import { adminAuth, AdminUser } from '../../services/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onSuccess: (user: AdminUser) => void;
  onCancel: () => void;
}

export function AdminLoginModal({ isOpen, onSuccess, onCancel }: AdminLoginModalProps) {
  const [email, setEmail] = useState('admin@kingsplatter.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await adminAuth.login(email.trim(), password);
      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@kingsplatter.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E0E12]/95 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#F5B800]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#F5B800]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card (Matches Screen 1 in Reference) */}
      <div className="relative w-full max-w-md bg-[#16161D] rounded-3xl border border-[#262632] p-6 sm:p-8 shadow-2xl shadow-black/80 z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#F5B800]/40 shadow-lg shadow-[#F5B800]/25 mx-auto mb-2 bg-[#111116] flex items-center justify-center p-0.5">
            <img
              src="/kings_platter_logo.jpg"
              alt="King's Platter"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#F5B800] via-[#E5A93C] to-[#C88A00] flex items-center justify-center"><svg class="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg></div>';
                }
              }}
            />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-3">
            Admin Portal
          </h2>
          <p className="text-xs text-gray-400 mt-1.5">
            Sign in with administrative credentials to manage your digital menu
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email / Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kingsplatter.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1C24] border border-[#2E2E3C] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] text-[#F5B800] hover:underline cursor-pointer"
              >
                Auto-fill demo
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1C1C24] border border-[#2E2E3C] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button (Golden Royal) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-bold text-sm tracking-wide shadow-lg shadow-[#F5B800]/20 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Shield className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>

          {/* Demo note */}
          <div className="p-3 bg-[#111116] rounded-xl border border-[#21212B] text-center">
            <span className="text-[11px] text-gray-400">
              Demo access: <strong className="text-gray-300">admin@kingsplatter.com</strong> / <strong className="text-[#F5B800]">admin123</strong>
            </span>
          </div>

        </form>

        {/* Back to customer menu */}
        <div className="mt-6 pt-4 border-t border-[#23232F] text-center">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Menu</span>
          </button>
        </div>

      </div>

    </div>
  );
}
