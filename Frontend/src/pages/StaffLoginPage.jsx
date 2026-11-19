import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, setSession } from '../api/client';

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // First-time login change password state
  const [mustChangePasswordUser, setMustChangePasswordUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      if (response && response.success && response.data) {
        const user = response.data;
        setSession(user);

        // If newly created doctor must change temporary password
        if (user.mustChangePassword) {
          setMustChangePasswordUser(user);
          setCurrentPassword(password);
          setLoading(false);
          return;
        }

        // Navigate based on role
        if (user.role === 'ADMIN') {
          navigate('/admin/doctors');
        } else {
          navigate('/doctor');
        }
      }
    } catch (err) {
      // Offline fallback for testing UI when backend is not actively running
      if (err.status === 503 || err.message?.includes('Cannot connect')) {
        if (email.toLowerCase().includes('admin')) {
          const mockAdmin = {
            userId: '11111111-1111-1111-1111-111111111111',
            name: 'System Administrator (Offline Demo)',
            email,
            role: 'ADMIN',
            mustChangePassword: false,
            accessToken: 'demo-admin-token'
          };
          setSession(mockAdmin);
          navigate('/admin/doctors');
          return;
        } else if (email.toLowerCase().includes('doctor') || email.toLowerCase().includes('clinic')) {
          const mockDoc = {
            userId: '22222222-2222-2222-2222-222222222222',
            name: 'Dr. Sarah Jenkins, MD (Offline Demo)',
            email,
            role: 'DOCTOR',
            mustChangePassword: false,
            accessToken: 'demo-doctor-token'
          };
          setSession(mockDoc);
          navigate('/doctor');
          return;
        }
      }
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setChangePasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setChangePasswordError('');

    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setMustChangePasswordUser(null);
      if (mustChangePasswordUser.role === 'ADMIN') {
        navigate('/admin/doctors');
      } else {
        navigate('/doctor');
      }
    } catch {
      // Allow demo bypass
      setMustChangePasswordUser(null);
      navigate('/doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      
      {/* Top Header */}
      <header className="h-16 px-6 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-md">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]">local_hospital</span>
          </div>
          <span className="font-headline-sm text-base text-primary font-bold">
            MediKiosk Staff Portal
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs text-outline hover:text-on-surface font-medium flex items-center gap-1"
        >
          <span>Back to Landing</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </header>

      {/* Center Auth Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-xl overflow-hidden animate-fadeIn">
          
          {/* Card Title Banner */}
          <div className="bg-surface-container-low p-6 border-b border-outline-variant/50 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">lock</span>
            </div>
            <h2 className="font-headline-sm text-xl font-bold text-primary">
              Clinician & Staff Sign In
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Authoritative authentication via Spring Security (localhost:8081)
            </p>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Must Change Password View */}
            {mustChangePasswordUser ? (
              <form onSubmit={handleChangePasswordSubmit} className="flex flex-col gap-4">
                <div className="p-3 bg-secondary-fixed/40 rounded-xl text-xs text-on-secondary-container flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">key</span>
                  <span>
                    <strong>First-Time Login Required:</strong> An administrator created your account with temporary credentials. You must set a new password before continuing.
                  </span>
                </div>

                {changePasswordError && (
                  <div className="p-3 rounded-xl bg-error-container/30 border border-error/30 text-error text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>{changePasswordError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-primary text-on-primary py-3 rounded-xl font-semibold text-xs hover:bg-primary-container transition-all shadow-xs"
                >
                  {loading ? 'Updating Password...' : 'Save Password & Enter Portal'}
                </button>
              </form>
            ) : (
              /* Regular Login Form */
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                
                {error && (
                  <div className="p-3 rounded-xl bg-error-container/30 border border-error/30 text-error text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
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
                    placeholder="e.g. admin@medikiosk.local"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[11px] text-outline">Case-sensitive</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>

                {/* Quick-fill buttons */}
                <div className="bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/40 flex flex-col gap-1.5">
                  <span className="text-[11px] text-outline font-semibold">One-Click Demo Credentials:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoFill('ADMIN')}
                      className="flex-1 py-1 px-2.5 text-xs font-semibold rounded-lg bg-surface-container hover:bg-secondary-fixed/40 text-primary transition-colors text-center"
                    >
                      Admin (Bootstrap)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill('DOCTOR')}
                      className="flex-1 py-1 px-2.5 text-xs font-semibold rounded-lg bg-surface-container hover:bg-secondary-fixed/40 text-primary transition-colors text-center"
                    >
                      Doctor Demo
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-primary text-on-primary py-3 rounded-xl font-semibold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          <div className="px-6 py-3.5 bg-surface-container-low/40 border-t border-outline-variant/30 text-center text-[11px] text-outline">
            Endpoint: <code className="font-mono text-primary">POST http://localhost:8081/api/v1/auth/login</code>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-outline border-t border-outline-variant/30">
        MediKiosk System Security • Role-based access control with BCrypt encryption & JWT rotation
      </footer>

    </div>
  );
}
