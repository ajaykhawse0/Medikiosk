import React from 'react';

export default function LandingHeader({ onStaffLogin, onStartIntake }) {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#E4EAE8]">
      <div className="h-20 max-w-[1120px] mx-auto px-gutter flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-xs">
            <span className="material-symbols-outlined text-[24px]">local_hospital</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
            MediKiosk
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-space-lg">
          <a
            href="#home"
            className="transition-colors py-space-xs text-primary font-label-md text-label-md font-semibold border-b-2 border-secondary"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
          >
            Features
          </a>
          <a
            href="#clinician"
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
          >
            Clinician Workspace
          </a>
          <a
            href="/doctor"
            className="font-label-md text-label-md text-secondary hover:text-primary transition-colors py-space-xs font-semibold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            Doctor Queue
          </a>
        </nav>

        <div className="flex items-center gap-space-md">
          <a
            href="/doctor"
            className="hidden sm:inline-flex items-center justify-center font-label-md text-label-md text-primary bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 px-space-md py-space-sm rounded-xl transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] mr-1 text-secondary">dashboard</span>
            Doctor Dashboard
          </a>
          <button
            type="button"
            onClick={onStaffLogin}
            className="inline-flex items-center justify-center font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary px-space-md py-space-sm rounded-xl transition-all shadow-[0_2px_8px_rgba(30,42,46,0.04)] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            <span className="material-symbols-outlined text-[18px] mr-1.5">lock</span>
            Staff Login
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
