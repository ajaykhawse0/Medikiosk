import React, { useState } from 'react';

export default function ClinicianWorkspaceSection({ onStaffLogin }) {
  const [chartApproved, setChartApproved] = useState(false);
  const [nurseFlagged, setNurseFlagged] = useState(false);

  return (
    <section id="clinician" className="w-full py-space-xl bg-surface">
      <div className="max-w-[1120px] mx-auto px-gutter">
        <div className="bg-[#EEF6F3] border border-outline-variant/70 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            
            {/* Left Column: Description & Value Props */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <span className="bg-surface-container-lowest/90 text-primary border border-outline-variant/60 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide mb-space-md shadow-2xs">
                CLINICIAN WORKSPACE
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold mb-space-md leading-tight">
                Everything You Need for a Better Patient Review.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                Say goodbye to deciphering illegible handwriting. MediKiosk surfaces patient-reported histories,
                discomfort scores, and uploaded documents in a unified chronological dashboard that cuts prep time in half.
              </p>

              <ul className="flex flex-col gap-3 mb-space-lg w-full">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">
                    Chronological timeline of patient-reported symptoms & onset
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">
                    Flagged drug allergies and contraindicating current medications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">
                    One-click document viewer with high-resolution file inspection
                  </span>
                </li>
              </ul>

              <button
                type="button"
                onClick={onStaffLogin}
                className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg px-6 py-3.5 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Staff Login</span>
              </button>
            </div>

            {/* Right Column: Interactive Encounter Card Preview */}
            <div className="lg:col-span-6 w-full">
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-md p-space-md sm:p-space-lg flex flex-col gap-space-md">
                
                {/* Header with Patient Info & Status */}
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-space-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">Jane Doe</span>
                      <span className="font-label-sm text-label-sm text-outline">#MK-8842</span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      DOB: 10/14/1982 • Female • Self-Check-in via Kiosk
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Ready for Review
                  </span>
                </div>

                {/* Submission Metadata */}
                <div className="grid grid-cols-2 gap-2 text-label-sm font-label-sm bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                  <div>
                    <span className="text-outline block text-[11px]">Submission Time</span>
                    <span className="font-semibold text-primary">8 mins ago (10:34 AM)</span>
                  </div>
                  <div>
                    <span className="text-outline block text-[11px]">Triage Urgency</span>
                    <span className="font-semibold text-primary">Tier 3 (Routine Ambulatory)</span>
                  </div>
                </div>

                {/* Clinical Alerts & Flags */}
                <div>
                  <p className="font-label-sm text-label-sm text-outline font-semibold mb-1.5">CLINICAL ALERTS & FLAGS</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold border border-tertiary/20">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">warning</span>
                      Penicillin Allergy (Severe)
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">device_thermostat</span>
                      Reported Low Grade Fever (38.1°C)
                    </span>
                  </div>
                </div>

                {/* Chief Complaint Summary */}
                <div className="border border-outline-variant/50 rounded-xl p-3 bg-surface-container-lowest">
                  <p className="font-label-sm text-label-sm text-primary font-bold mb-1">Chief Complaint Summary</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Patient notes productive cough and fatigue ongoing for 4 days. Denies shortness of breath at rest. Uploaded vaccination verification file.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setChartApproved(!chartApproved)}
                    className={`flex-1 font-label-sm text-label-sm font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      chartApproved
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-primary text-on-primary hover:bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {chartApproved ? 'check' : 'task_alt'}
                    </span>
                    {chartApproved ? 'Approved for Charting' : 'Approve for Charting'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setNurseFlagged(!nurseFlagged)}
                    className={`flex-1 font-label-sm text-label-sm font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      nurseFlagged
                        ? 'bg-tertiary text-on-tertiary'
                        : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">notifications_active</span>
                    {nurseFlagged ? 'Flagged for Nurse' : 'Flag for Nurse Triage'}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
