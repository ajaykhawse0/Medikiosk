import React from 'react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      numBg: 'bg-primary text-on-primary',
      title: 'Start Your Intake',
      description: 'Access via kiosk tablet or your mobile device using your appointment code or secure one-time link.',
      badgeText: 'Instant Touchless Pairing',
      badgeIcon: 'qr_code_scanner',
      badgeColor: 'text-secondary'
    },
    {
      number: '02',
      numBg: 'bg-secondary text-on-secondary',
      title: 'Complete Your Information',
      description: 'Answer structured health questions, sign digital consent waivers, and upload existing lab or referral documents.',
      badgeText: 'Legally Binding e-Signature',
      badgeIcon: 'draw',
      badgeColor: 'text-primary'
    },
    {
      number: '03',
      numBg: 'bg-primary-container text-on-primary',
      title: 'Clinician Reviews File',
      description: 'Your assigned care team instantly receives an organized summary ready for direct clinical encounter review.',
      badgeText: 'Instant Encounter Handoff',
      badgeIcon: 'bolt',
      badgeColor: 'text-tertiary-container'
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-space-xl bg-surface">
      <div className="max-w-[1120px] mx-auto px-gutter">
        {/* Section Intro */}
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <p className="font-label-sm text-label-sm font-bold tracking-widest text-primary uppercase mb-2">
            EASY 3-STEP PROCESS
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            From check-in to clinical consultation in three clear steps
          </h2>
        </div>

        {/* Step Cards Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-outline-variant/60 -translate-y-8 z-0"></div>

          {steps.map((st, i) => (
            <div
              key={i}
              className="relative z-10 bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/60 shadow-[0_2px_8px_rgba(30,42,46,0.03)] flex flex-col items-start hover:-translate-y-1 transition-transform duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${st.numBg} font-headline-sm text-headline-sm flex items-center justify-center font-bold mb-space-md shadow-sm`}>
                {st.number}
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2 font-bold">
                {st.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {st.description}
              </p>
              <div className={`mt-4 pt-3 border-t border-outline-variant/40 w-full flex items-center ${st.badgeColor} font-label-sm text-label-sm font-semibold gap-1.5`}>
                <span className="material-symbols-outlined text-[16px]">{st.badgeIcon}</span>
                {st.badgeText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
