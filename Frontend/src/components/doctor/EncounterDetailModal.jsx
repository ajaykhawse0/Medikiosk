import React, { useState } from 'react';

export default function EncounterDetailModal({ encounter, isOpen, onClose, onUpdateStatus }) {
  if (!isOpen || !encounter) return null;

  const [note, setNote] = useState(encounter.clinicalNotes || '');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState('');

  const handleApprove = () => {
    onUpdateStatus(encounter.id, 'REVIEWED', note);
    setIsSuccessMessage('Encounter approved and charted successfully!');
    setTimeout(() => {
      setIsSuccessMessage('');
      onClose();
    }, 1200);
  };

  const handleFlagForNurse = () => {
    onUpdateStatus(encounter.id, 'UNDER_REVIEW', note ? `[FLAGGED FOR NURSE] ${note}` : 'Flagged for urgent nurse triage triage assessment.');
    setIsSuccessMessage('Encounter flagged for nurse follow-up!');
    setTimeout(() => {
      setIsSuccessMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl border border-outline-variant/70 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">clinical_notes</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-lg font-bold text-primary">
                  {encounter.patientName}
                </h3>
                <span className="font-mono text-xs text-outline bg-surface-container px-2 py-0.5 rounded">
                  {encounter.id}
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                DOB: {encounter.dob} • {encounter.gender}, {encounter.age} years old • {encounter.sessionSource}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              encounter.status === 'REVIEWED'
                ? 'bg-surface-container-high text-outline'
                : 'bg-secondary-fixed text-primary'
            }`}>
              {encounter.status === 'REVIEWED' ? '✓ Charted' : 'Awaiting Clinician Action'}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="text-outline hover:text-on-surface p-1.5 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">

          {/* Success Banner */}
          {isSuccessMessage && (
            <div className="p-4 rounded-2xl bg-secondary-fixed/50 border border-secondary text-primary font-semibold text-sm flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
              <span>{isSuccessMessage}</span>
            </div>
          )}

          {/* Top Triage & Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Triage & Discomfort */}
            <div className="bg-surface-container-low/70 p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1">
                  Triage Category
                </span>
                <span className="font-headline-sm text-sm font-bold text-primary block">
                  {encounter.triageTier}: {encounter.triageLabel}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-medium">Reported Pain Score:</span>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  encounter.discomfortIndex >= 7
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                    : 'bg-surface-container-high text-primary'
                }`}>
                  {encounter.discomfortIndex} / 10
                </span>
              </div>
            </div>

            {/* Clinical Alerts & Flags */}
            <div className="md:col-span-2 bg-surface-container-low/70 p-4 rounded-2xl border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1">
                  Clinical Alerts & Contraindications
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {encounter.alerts?.map((alt, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold ${
                        alt.severity === 'critical'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/20'
                          : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {alt.severity === 'critical' ? 'warning' : 'info'}
                      </span>
                      {alt.text}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-outline mt-2 pt-2 border-t border-outline-variant/40">
                Patient identity verified via normalized email: <span className="font-mono text-primary">{encounter.email}</span>
              </p>
            </div>

          </div>

          {/* Chief Complaint Box */}
          <div className="bg-[#EEF6F3] p-4 sm:p-5 rounded-2xl border border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">medical_information</span>
              <h4 className="font-headline-sm text-sm font-bold text-primary">Chief Complaint & Intake Overview</h4>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {encounter.chiefComplaint}
            </p>
          </div>

          {/* Structured Questionnaire Answers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">quiz</span>
                Structured Health Questionnaire Answers
              </h4>
              <span className="text-[11px] text-outline">Version: PRD-Q-2026.1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {encounter.answers?.map((ans, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-surface-container-low/60 rounded-xl border border-outline-variant/40"
                >
                  <span className="text-[11px] font-semibold text-outline block mb-1">
                    {ans.question}
                  </span>
                  <span className="text-xs font-medium text-primary block leading-relaxed">
                    {ans.answer}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Uploaded Documents */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">attach_file</span>
                Supporting Uploaded Documents ({encounter.documents?.length || 0})
              </h4>
              <span className="text-[11px] text-outline">Stored in secure private storage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {encounter.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/60 flex items-center justify-between hover:border-secondary transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        {doc.type === 'IMAGE' ? 'image' : 'picture_as_pdf'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="font-label-sm text-xs font-semibold text-primary block truncate">
                        {doc.name}
                      </span>
                      <span className="text-[10px] text-outline block">
                        {doc.size} • Checksum Verified
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    className="px-2.5 py-1 text-xs text-secondary hover:text-on-secondary-container hover:bg-secondary-fixed/30 rounded-lg font-semibold transition-colors shrink-0"
                  >
                    View File
                  </button>
                </div>
              ))}
            </div>

            {/* Document Viewer Modal */}
            {selectedDoc && (
              <div className="p-4 mt-2 bg-surface-container-high rounded-2xl border border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">verified</span>
                  <span className="text-xs font-medium text-primary">
                    Previewing {selectedDoc.name} ({selectedDoc.size}) — Verified digital patient upload.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="text-xs text-outline hover:text-on-surface font-semibold underline"
                >
                  Close Preview
                </button>
              </div>
            )}
          </div>

          {/* Clinician Action / Notes Area */}
          <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/60 flex flex-col gap-3">
            <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Clinician Review Notes & Disposition
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter assessment findings, prescription renewals, or triage recommendations..."
              className="w-full p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-secondary text-on-surface"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-outline">
                State transition: {encounter.status} → REVIEWED. Recorded in PostgreSQL audit log.
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleFlagForNurse}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                  <span>Flag for Nurse</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Approve & Sign Chart</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
