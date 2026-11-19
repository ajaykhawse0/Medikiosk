import React from 'react';

export default function LandingFooter({ onStaffLogin }) {
  return (
    <footer className="w-full bg-surface-container-low border-t border-[#E4EAE8] py-space-xl">
      <div className="max-w-[1120px] mx-auto px-gutter flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg border-b border-[#E4EAE8]">
          <div className="flex flex-col gap-space-xs max-w-md">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                MediKiosk
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Next-generation clinical patient intake platform engineered for radical legibility, dignity, and calm assurance in ambulatory environments.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-space-md">
            <a href="#home" className="transition-colors text-primary font-medium hover:underline">
              Home
            </a>
            <a href="#features" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
              How It Works
            </a>
            <a href="/doctor" className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors font-medium">
              Doctor Dashboard
            </a>
            <button
              type="button"
              onClick={onStaffLogin}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Staff Login
            </button>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <p className="max-w-2xl text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
            © 2026 MediKiosk Systems. MediKiosk is an academic prototype designed to support patient information collection and clinician review. It does not provide autonomous diagnosis or treatment recommendations.
          </p>
          <p className="font-label-sm text-label-sm whitespace-nowrap text-outline">
            v1.0.4 Academic Build
          </p>
        </div>
      </div>
    </footer>
  );
}
