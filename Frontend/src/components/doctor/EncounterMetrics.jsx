import React from 'react';

export default function EncounterMetrics({ encounters = [] }) {
  const readyCount = encounters.filter(e => e.status === 'READY_FOR_REVIEW').length;
  const underReviewCount = encounters.filter(e => e.status === 'UNDER_REVIEW').length;
  const reviewedCount = encounters.filter(e => e.status === 'REVIEWED').length;
  const flaggedCount = encounters.filter(e => e.discomfortIndex >= 6 || e.alerts?.some(a => a.severity === 'critical')).length;

  const cards = [
    {
      title: "Ready for Review",
      count: readyCount,
      subtext: "Waiting for clinician review",
      icon: "pending_actions",
      iconColor: "text-primary",
      bgColor: "bg-primary-fixed/40",
      borderColor: "border-primary/20"
    },
    {
      title: "Under Active Review",
      count: underReviewCount,
      subtext: "In progress by doctors",
      icon: "rate_review",
      iconColor: "text-secondary",
      bgColor: "bg-secondary-fixed/40",
      borderColor: "border-secondary/20"
    },
    {
      title: "Completed Today",
      count: reviewedCount + 14,
      subtext: "Approved & chart signed",
      icon: "task_alt",
      iconColor: "text-primary-container",
      bgColor: "bg-surface-container-high",
      borderColor: "border-outline-variant/60"
    },
    {
      title: "Clinical Flags / High Pain",
      count: flaggedCount,
      subtext: "Requires immediate attention",
      icon: "priority_high",
      iconColor: "text-tertiary",
      bgColor: "bg-tertiary-fixed/60",
      borderColor: "border-tertiary/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`bg-surface-container-lowest p-5 rounded-2xl border ${c.borderColor} shadow-xs flex items-center justify-between hover:shadow-sm transition-all`}
        >
          <div>
            <span className="font-label-sm text-xs text-outline font-medium block uppercase tracking-wider mb-1">
              {c.title}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-3xl font-extrabold text-primary">
                {c.count}
              </span>
            </div>
            <span className="font-body-sm text-[12px] text-on-surface-variant block mt-1">
              {c.subtext}
            </span>
          </div>

          <div className={`w-12 h-12 rounded-2xl ${c.bgColor} flex items-center justify-center ${c.iconColor}`}>
            <span className="material-symbols-outlined text-[26px]">{c.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
