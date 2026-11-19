import React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      icon: 'quiz',
      title: 'Digital Questionnaire',
      desc: 'Adaptive forms that prompt only relevant health history questions based on previous answers, reducing intake friction.',
      badge: 'Dynamic Branching'
    },
    {
      icon: 'history_edu',
      title: 'Consent Management',
      desc: 'Digital signature capture for treatment consent, privacy disclosures, and telehealth authorizations with policy versioning.',
      badge: 'Audit-Logged PDF Export'
    },
    {
      icon: 'upload_file',
      title: 'Document Uploads',
      desc: 'Direct camera capture or file upload for photo ID, insurance cards, prior lab sheets, and medication container labels.',
      badge: 'Verified File Registry'
    },
    {
      icon: 'sync_saved_locally',
      title: 'Save and Resume',
      desc: 'Pause completion anytime and pick back up seamlessly across kiosks or patient smartphones without losing entered data.',
      badge: 'Cross-Device Sessioning'
    },
    {
      icon: 'table_chart_view',
      title: 'Review Dashboard',
      desc: 'Prioritized clinical queue displaying intake completion times, flagged red-flag allergies, and clean summaries.',
      badge: 'At-a-glance Triage Flags'
    },
    {
      icon: 'admin_panel_settings',
      title: 'Secure Role-Based Access',
      desc: 'Granular staff permissions ensuring clinical data is strictly accessible by authorized physicians, nurses, and registrars.',
      badge: 'Enterprise RBAC & Audit'
    }
  ];

  return (
    <section id="features" className="w-full py-space-xl bg-surface-container-low/50">
      <div className="max-w-[1120px] mx-auto px-gutter">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-4">
          <div>
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
              Intake Innovation
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold mt-1">
              Platform Capabilities
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Engineered specifically for clinical intake efficiency, regulatory integrity, and patient ease.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {features.map((feat, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/50 hover:border-secondary/60 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-secondary-fixed/30 flex items-center justify-center text-primary mb-space-md transition-colors shadow-2xs">
                  <span className="material-symbols-outlined text-[26px]">{feat.icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
                  {feat.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-space-md mt-space-md border-t border-outline-variant/30 flex items-center justify-between text-label-sm font-label-sm text-primary">
                <span className="font-medium">{feat.badge}</span>
                <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
