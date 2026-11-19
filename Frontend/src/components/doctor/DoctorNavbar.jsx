import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DoctorNavbar({
  doctor = { name: "Dr. Sarah Jenkins, MD", role: "DOCTOR", department: "Ambulatory & Urgent Care" },
  onOpenPatientSearch,
  onOpenProfile,
  onOpenResetPassword,
  onLogout
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E4EAE8]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs group-hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[24px]">local_hospital</span>
            </div>
            <div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight block leading-tight">
                MediKiosk
              </span>
              <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase tracking-wider block">
                Clinician Portal
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 ml-2 border-l border-outline-variant/60">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-xs font-medium text-on-surface-variant">
              Ambulatory Intake Queue • Active
            </span>
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Patient Search Button */}
          <button
            type="button"
            onClick={onOpenPatientSearch}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-primary font-label-sm text-xs font-semibold shadow-2xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
            <span className="hidden sm:inline">Search Patient</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface-container-lowest rounded border border-outline-variant/60 text-outline">
              ⌘K
            </kbd>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-2xs focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                SJ
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-label-sm text-xs font-semibold text-primary block leading-tight">
                  {doctor.name}
                </span>
                <span className="font-label-sm text-[11px] text-outline block leading-tight">
                  {doctor.department}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">
                {menuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl border border-outline-variant/70 shadow-lg py-2 z-50 animate-fadeIn"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-outline-variant/40">
                  <p className="font-label-sm text-xs font-bold text-primary">{doctor.name}</p>
                  <p className="font-body-sm text-[11px] text-outline">Role: {doctor.role || 'DOCTOR'}</p>
                </div>

                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onOpenProfile(); }}
                  className="w-full px-4 py-2 text-left font-label-sm text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
                  <span>Doctor Profile & Specialization</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onOpenResetPassword(); }}
                  className="w-full px-4 py-2 text-left font-label-sm text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">lock_reset</span>
                  <span>Request Password Reset</span>
                </button>

                <div className="my-1 border-t border-outline-variant/40"></div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left font-label-sm text-xs text-error hover:bg-error-container/20 flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
