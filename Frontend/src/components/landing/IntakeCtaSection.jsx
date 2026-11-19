import React from 'react';

export default function IntakeCtaSection({ onStartIntake }) {
  return (
    <section className="w-full py-space-xl bg-surface-container-low border-t border-outline-variant/50">
      <div className="max-w-[1120px] mx-auto px-gutter text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary-container/40 text-primary flex items-center justify-center mb-space-md shadow-xs">
          <span className="material-symbols-outlined text-[30px]">local_hospital</span>
        </div>

        <h2 className="font-headline-lg text-headline-lg text-primary font-bold mb-2">
          Ready to check in for your appointment?
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-space-lg leading-relaxed">
          Start your confidential intake questionnaire now. It only takes 3–5 minutes, and your healthcare team will receive it immediately upon arrival.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onStartIntake}
            className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg px-8 py-3.5 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            <span>Begin Patient Intake</span>
            <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
          </button>

          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 bg-surface text-primary hover:bg-surface-container-lowest border border-outline-variant/80 font-label-lg text-label-lg px-6 py-3.5 rounded-xl transition-all"
          >
            <span>Read Intake Guide</span>
          </a>
        </div>
      </div>
    </section>
  );
}
