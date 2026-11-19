import React, { useState } from 'react';

export default function EncounterQueueTable({ encounters = [], onSelectEncounter }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEncounters = encounters.filter((enc) => {
    // Tab filter
    if (activeTab === 'READY' && enc.status !== 'READY_FOR_REVIEW') return false;
    if (activeTab === 'UNDER_REVIEW' && enc.status !== 'UNDER_REVIEW') return false;
    if (activeTab === 'REVIEWED' && enc.status !== 'REVIEWED') return false;
    if (activeTab === 'FLAGGED' && (enc.discomfortIndex < 6 && !enc.alerts?.some(a => a.severity === 'critical'))) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = enc.patientName.toLowerCase().includes(q);
      const matchId = enc.id.toLowerCase().includes(q);
      const matchComplaint = enc.chiefComplaint.toLowerCase().includes(q);
      const matchEmail = enc.email?.toLowerCase().includes(q);
      return matchName || matchId || matchComplaint || matchEmail;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'READY_FOR_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-container font-label-sm text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Ready for Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/50 text-primary font-label-sm text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Under Review
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-outline font-label-sm text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
            Reviewed & Approved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40">
          {[
            { id: 'ALL', label: 'All Encounters', count: encounters.length },
            { id: 'READY', label: 'Ready', count: encounters.filter(e => e.status === 'READY_FOR_REVIEW').length },
            { id: 'UNDER_REVIEW', label: 'In Progress', count: encounters.filter(e => e.status === 'UNDER_REVIEW').length },
            { id: 'REVIEWED', label: 'Completed', count: encounters.filter(e => e.status === 'REVIEWED').length },
            { id: 'FLAGGED', label: 'Flagged Alerts', count: encounters.filter(e => e.discomfortIndex >= 6 || e.alerts?.some(a => a.severity === 'critical')).length }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-secondary-fixed/50 text-primary' : 'bg-surface-container-high text-outline'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[260px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, ID, symptoms..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-secondary text-on-surface"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-outline hover:text-on-surface text-[14px]"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/70 border-b border-outline-variant/40 text-[11px] font-bold text-outline uppercase tracking-wider">
              <th className="py-3 px-4">Patient & Encounter</th>
              <th className="py-3 px-4">Check-in / Source</th>
              <th className="py-3 px-4">Triage & Pain</th>
              <th className="py-3 px-4">Chief Complaint & History</th>
              <th className="py-3 px-4">Alerts & Docs</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-xs">
            {filteredEncounters.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-outline">
                  <span className="material-symbols-outlined text-[36px] text-outline-variant block mb-2">
                    inbox
                  </span>
                  No encounters match the selected filter.
                </td>
              </tr>
            ) : (
              filteredEncounters.map((enc) => (
                <tr
                  key={enc.id}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  {/* Patient & ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary-container/40 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {enc.patientName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-headline-sm text-xs font-bold text-primary block group-hover:text-secondary transition-colors">
                          {enc.patientName}
                        </span>
                        <span className="font-mono text-[10px] text-outline block">
                          {enc.id} • {enc.gender}, {enc.age}y
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Checkin Time & Kiosk */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-primary block">{enc.checkinTime}</span>
                    <span className="text-[11px] text-outline block truncate max-w-[150px]" title={enc.sessionSource}>
                      {enc.sessionSource}
                    </span>
                  </td>

                  {/* Triage & Discomfort */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${enc.urgencyColor} bg-surface-container-lowest`}>
                        {enc.triageTier}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        enc.discomfortIndex >= 7
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : enc.discomfortIndex >= 4
                          ? 'bg-surface-variant text-primary font-semibold'
                          : 'bg-surface-container text-outline'
                      }`}>
                        Pain: {enc.discomfortIndex}/10
                      </span>
                    </div>
                  </td>

                  {/* Chief Complaint */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="line-clamp-2 text-on-surface-variant text-[12px] leading-relaxed">
                      {enc.chiefComplaint}
                    </p>
                  </td>

                  {/* Alerts & Docs */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {enc.alerts?.slice(0, 1).map((alt, ai) => (
                        <span
                          key={ai}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                            alt.severity === 'critical'
                              ? 'bg-tertiary-fixed/80 text-on-tertiary-fixed font-bold'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {alt.severity === 'critical' ? 'warning' : 'info'}
                          </span>
                          <span className="truncate max-w-[140px]">{alt.text}</span>
                        </span>
                      ))}

                      <span className="inline-flex items-center gap-1 text-[11px] text-outline font-medium">
                        <span className="material-symbols-outlined text-[14px] text-primary">description</span>
                        {enc.documents?.length || 0} document{enc.documents?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(enc.status)}
                  </td>

                  {/* Review Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectEncounter(enc)}
                      className="inline-flex items-center gap-1 bg-primary text-on-primary hover:bg-primary-container px-3 py-1.5 rounded-xl font-label-sm text-xs font-semibold transition-all shadow-2xs hover:shadow-xs"
                    >
                      <span>Review</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3.5 px-5 bg-surface-container-low/40 border-t border-outline-variant/30 flex items-center justify-between text-xs text-outline">
        <span>Showing {filteredEncounters.length} of {encounters.length} encounters</span>
        <span>MediKiosk Authoritative State: Spring Boot / PostgreSQL</span>
      </div>

    </div>
  );
}
