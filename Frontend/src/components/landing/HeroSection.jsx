import React, { useState } from 'react';

export default function HeroSection({ onStartIntake, onStaffLogin }) {
  const [selectedReason, setSelectedReason] = useState('acute');
  const [painLevel, setPainLevel] = useState(4);
  const [step, setStep] = useState(2);

  const reasons = [
    { id: 'acute', label: 'Acute respiratory or chest discomfort', icon: 'check_circle' },
    { id: 'preventive', label: 'Routine preventive exam & annual checkup', icon: 'circle' },
    { id: 'followup', label: 'Specialist follow-up & prescription renewal', icon: 'circle' }
  ];

  return (
    <section id="home" className="relative w-full overflow-hidden bg-surface pb-space-xl pt-space-md md:pt-space-lg">
      {/* Subtle Ambient Glow Elements */}
      <div className="absolute -top-32 right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-[-15%] w-[420px] h-[420px] rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none"></div>

      <div className="max-w-[1120px] mx-auto px-gutter relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center pt-space-sm md:pt-space-md">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 mb-space-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-primary tracking-wide font-medium">
                Streamlined Clinical Check-in
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg text-primary tracking-tight text-balance leading-tight mb-space-md">
              Healthcare Intake, <br className="hidden sm:inline" />
              <span className="text-secondary font-extrabold">Made Simpler.</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-lg leading-relaxed">
              MediKiosk transforms cumbersome paperwork into an organized, accessible digital experience—empowering
              patients to complete intake comfortably and helping clinicians review structured medical records in minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-space-md">
              <button
                type="button"
                onClick={onStartIntake}
                className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg px-7 py-3.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(30,42,46,0.06)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                <span>Start Patient Intake</span>
                <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
              </button>

              <button
                type="button"
                onClick={onStaffLogin}
                className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-outline-variant/60 font-label-lg text-label-lg px-6 py-3.5 rounded-xl transition-all shadow-[0_1px_3px_rgba(30,42,46,0.03)] focus:outline-none"
              >
                <span className="material-symbols-outlined text-primary text-[19px]">lock</span>
                <span>Staff Login</span>
              </button>
            </div>

            {/* Micro-trust badge */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-label-sm font-label-sm text-outline pt-space-xs">
              <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                Verified Patient Privacy
              </span>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[16px]">devices</span>
                Zero App Download Needed
              </span>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[16px]">lock_clock</span>
                Role-Based Clinician Access
              </span>
            </div>
          </div>

          {/* Right Column: Tablet & Floating Badges Mockup */}
          <div className="lg:col-span-6 relative mt-space-md lg:mt-0 flex justify-center">
            {/* Ambient Backplate */}
            <div className="absolute inset-0 max-w-[460px] mx-auto bg-gradient-to-tr from-secondary-fixed/30 via-surface-container-low to-primary-fixed/20 rounded-3xl -rotate-2 transform scale-105 filter blur-lg opacity-80 pointer-events-none"></div>

            {/* Mockup Shell Frame */}
            <div className="relative w-full max-w-[480px] bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-[0_16px_36px_-6px_rgba(30,42,46,0.09),0_6px_14px_-2px_rgba(30,42,46,0.04)] overflow-hidden">
              {/* Mockup Header */}
              <div className="bg-surface-container-low border-b border-outline-variant/50 px-space-md py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                  <span className="ml-2 font-label-sm text-label-sm font-semibold text-primary">
                    MediKiosk Ambulatory Terminal
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Connected</span>
                </div>
              </div>

              {/* Terminal Screen Body */}
              <div className="p-space-md sm:p-space-lg flex flex-col gap-space-md bg-surface-container-lowest">
                {/* Progress Indicator */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-label-sm text-label-sm text-primary font-semibold">
                      General Health Questionnaire
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-medium">
                      Step {step} of 4: Symptoms
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary-fixed-dim h-full rounded-full transition-all duration-500"
                      style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Container */}
                <div className="bg-surface-container-low/70 rounded-xl p-3.5 border border-outline-variant/40 flex flex-col gap-2.5">
                  <p className="font-headline-sm text-[15px] font-semibold text-primary leading-tight">
                    Primary reason for today's clinical consultation?
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    {reasons.map((r) => {
                      const isSelected = selectedReason === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setSelectedReason(r.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-surface-container-lowest border-2 border-primary-container shadow-xs'
                              : 'bg-surface-container-lowest border border-outline-variant/50 hover:border-outline text-on-surface-variant'
                          }`}
                        >
                          <span className={`font-label-md text-label-md flex items-center gap-2 ${isSelected ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined text-[18px] text-secondary">
                              {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            {r.label}
                          </span>
                          {isSelected && (
                            <span className="font-label-sm text-label-sm text-primary bg-secondary-fixed/40 px-2 py-0.5 rounded font-medium">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pain Scale Slider Interactive */}
                <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/40">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Current Discomfort Index:</span>
                    <span className="font-label-sm text-label-sm font-bold text-tertiary">
                      {painLevel <= 3 ? 'Mild' : painLevel <= 6 ? 'Moderate' : 'Severe'} ({painLevel} / 10)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-between">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPainLevel(num)}
                        title={`Discomfort level ${num}`}
                        className={`h-3 flex-1 rounded transition-all ${
                          num <= painLevel ? 'bg-secondary' : 'bg-surface-variant hover:bg-outline-variant/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="text-on-surface-variant font-label-sm text-label-sm px-3 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(4, s + 1))}
                    className="bg-primary text-on-primary font-label-sm text-label-sm font-semibold px-4 py-1.5 rounded-lg shadow-xs hover:bg-primary-container transition-colors flex items-center gap-1"
                  >
                    Save & Continue
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Pill 1: Top Right Signature Captured */}
            <div className="absolute -top-4 -right-2 sm:-right-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3 shadow-md flex items-center gap-3 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm font-semibold text-primary">Consent Verified</p>
                <p className="font-label-sm text-[11px] text-outline">Digital signature captured • 10:42 AM</p>
              </div>
            </div>

            {/* Floating Pill 2: Bottom Left Uploaded Records */}
            <div className="absolute -bottom-5 -left-2 sm:-left-6 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3 shadow-md flex items-center gap-3 max-w-[290px]">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">description</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-label-sm text-label-sm font-semibold text-primary truncate">Lab_Results_2024.pdf</p>
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span>
                </div>
                <p className="font-label-sm text-[11px] text-outline">2.4 MB • Encrypted document verified</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
