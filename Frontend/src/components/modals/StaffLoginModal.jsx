import React, { useState } from 'react';
import { authApi, setSession as storeSession } from '../../api/client';

export default function StaffLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);

  if (!isOpen) return null;

  const handleDemoFill = (role) => {
    setError('');
    if (role === 'ADMIN') {
      setEmail('admin@medikiosk.local');
      setPassword('Ajay@Medikiosk06');
    } else {
      setEmail('doctor@clinic.com');
      setPassword('Ajay@Medikiosk06');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authApi.login({ email, password });

      if (data && data.success && data.data) {
        storeSession(data.data);
        setSession(data.data);
        if (onLoginSuccess) onLoginSuccess(data.data);
      } else {
        setError(data?.message || 'Invalid credentials. Please verify your email & password.');
      }
    } catch (err) {
      // Backend not running on 8081 -> provide demo preview login
      if (email === 'admin@medikiosk.local' || email.includes('admin')) {
        const mockAdmin = {
          userId: '11111111-1111-1111-1111-111111111111',
          name: 'System Administrator (Offline Demo)',
          email,
          role: 'ADMIN',
          mustChangePassword: false,
          accessToken: 'demo-admin-jwt-preview'
        };
        storeSession(mockAdmin);
        setSession(mockAdmin);
        if (onLoginSuccess) onLoginSuccess(mockAdmin);
      } else {
        setError(err.message || 'Cannot reach Spring backend on localhost:8081. (Demo Admin login works offline).');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">lock</span>
            <h3 className="font-headline-sm text-[18px] font-bold text-primary">Staff Portal Authentication</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {session ? (
            <div className="flex flex-col gap-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 text-secondary mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-primary font-bold">Authenticated as {session.name}</h4>
                <p className="font-body-sm text-on-surface-variant text-[13px]">{session.email}</p>
                <span className="inline-block mt-2 font-label-sm text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary text-on-primary">
                  ROLE: {session.role}
                </span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl text-left border border-outline-variant/40 text-[11px] font-mono break-all text-outline">
                Session Active • Bearer token ready
              </div>
              <button
                type="button"
                onClick={() => setSession(null)}
                className="mt-2 text-on-surface-variant hover:text-primary text-sm font-medium"
              >
                Sign out of demo session
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-xl bg-error-container/30 border border-error/30 text-error text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                />
              </div>

              {/* Demo quick fill pills */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-outline">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => handleDemoFill('ADMIN')}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-secondary-fixed/30 text-primary font-medium transition-colors"
                >
                  Admin Bootstrap
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('DOCTOR')}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-secondary-fixed/30 text-primary font-medium transition-colors"
                >
                  Doctor Demo
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-primary text-on-primary font-label-md py-3 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 font-semibold shadow-xs"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Staff Workspace</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
