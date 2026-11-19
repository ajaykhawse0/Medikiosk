import React from 'react';

export default function TrustHighlightsSection() {
  const highlights = [
    {
      icon: 'touch_app',
      iconBg: 'bg-primary-fixed/50',
      title: 'Guided Patient Intake',
      description: 'Accessible, large touch targets with multi-language support and intuitive step-by-step guidance.'
    },
    {
      icon: 'security',
      iconBg: 'bg-secondary-fixed/50',
      title: 'Secure Data Handling',
      description: 'Role-based encrypted storage strictly compliant with healthcare privacy standards and audited access.'
    },
    {
      icon: 'clinical_notes',
      iconBg: 'bg-surface-container-high',
      title: 'Clinician-Led Review',
      description: 'Standardized record formats designed for rapid clinician triage, note review, and chart verification.'
    }
  ];

  return (
    <section className="w-full bg-surface-container-lowest border-y border-outline-variant/40 py-space-lg">
      <div className="max-w-[1120px] mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-2xl p-space-md border border-outline-variant/50 hover:shadow-sm transition-all flex items-start gap-space-sm"
            >
              <div className={`w-11 h-11 shrink-0 rounded-xl ${item.iconBg} flex items-center justify-center text-primary shadow-xs`}>
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-[17px] font-bold text-primary mb-1">
                  {item.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
