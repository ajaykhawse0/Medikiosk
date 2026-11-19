import React, { useState } from 'react';

export default function PatientIntakeModal({ isOpen, onClose }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">health_and_safety</span>
            <h3 className="font-headline-sm text-[18px] font-bold text-primary">Patient Intake Kiosk Terminal</h3>
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
          {submitted ? (
            <div className="text-center py-4 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h4 className="font-headline-sm text-primary font-bold">Intake Session Initialized</h4>
              <p className="font-body-md text-on-surface-variant max-w-xs text-sm">
                Welcome, <strong>{fullName}</strong>. Your session token has been created and bound to <strong>{email}</strong>.
              </p>
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50 text-xs text-outline w-full text-center font-mono">
                Session ID: MK-SESSION-2026-INTAKE
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md font-semibold hover:bg-primary-container"
              >
                Proceed to Medical Questionnaire
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Please enter your details to verify your intake record. MediKiosk connects your responses directly to your clinician's encounter review queue.
              </p>

              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  Patient Email Identity (No Password Needed)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane.doe@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                />
              </div>

              <div className="p-3 bg-secondary-fixed/20 rounded-xl border border-secondary/20 text-xs text-on-secondary-container flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">info</span>
                <span>Per MediKiosk architectural model, patients do not create passwords. Your verified email identity binds your clinical questionnaire records securely.</span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-primary text-on-primary font-label-md py-3 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 font-semibold shadow-xs"
              >
                <span>Begin Patient Intake</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
