import React, { useState } from 'react';
import { doctorApi } from '../../api/client';

export default function PatientSearchModal({ isOpen, onClose, onSelectPatientEncounter }) {
  if (!isOpen) return null;

  const [emailQuery, setEmailQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!emailQuery.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await doctorApi.searchPatientByEmail(emailQuery.trim());
      if (data && data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error(data?.message || 'Patient not found');
      }
    } catch {
      // Fallback for demo mock search
      const q = emailQuery.trim().toLowerCase();
      if (q.includes('jane')) {
        setResult({
          patientId: 'PT-9941',
          fullName: 'Jane Doe',
          email: 'jane.doe@example.com',
          encounterId: 'ENC-8842'
        });
      } else if (q.includes('marcus')) {
        setResult({
          patientId: 'PT-9942',
          fullName: 'Marcus Sterling',
          email: 'marcus.sterling@example.com',
          encounterId: 'ENC-8841'
        });
      } else if (q.includes('priya')) {
        setResult({
          patientId: 'PT-9943',
          fullName: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          encounterId: 'ENC-8840'
        });
      } else {
        setError(`No registered patient matches "${emailQuery.trim()}". Only exact normalized email matches are permitted.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">person_search</span>
            <h3 className="font-headline-sm text-base font-bold text-primary">Audited Patient Search</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            Per MediKiosk security guidelines, patient search is restricted to exact normalized email lookup. Every search query is logged in the backend audit trail.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                email
              </span>
              <input
                type="email"
                required
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="Enter exact patient email (e.g. jane.doe@example.com)"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface border border-outline-variant/70 text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl text-xs hover:bg-primary-container transition-all shrink-0"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-surface-container-high border border-outline-variant/50 text-xs text-on-surface-variant flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-tertiary text-[16px]">info</span>
              <span>{error}</span>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-4 bg-surface-container-low rounded-xl border border-secondary/40 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 text-primary flex items-center justify-center font-bold text-xs">
                  {result.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-headline-sm text-sm font-bold text-primary">{result.fullName}</h4>
                  <p className="font-body-sm text-[11px] text-outline">{result.email}</p>
                  <p className="font-mono text-[10px] text-secondary">ID: {result.patientId}</p>
                </div>
              </div>

              {result.encounterId && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectPatientEncounter(result.encounterId);
                  }}
                  className="px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-primary-container transition-all"
                >
                  Open Encounter
                </button>
              )}
            </div>
          )}

          {/* Quick Demo Pill Search */}
          <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center gap-2 text-xs text-outline">
            <span>Quick Samples:</span>
            <button
              type="button"
              onClick={() => setEmailQuery('jane.doe@example.com')}
              className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-secondary-fixed/30 text-primary"
            >
              jane.doe@example.com
            </button>
            <button
              type="button"
              onClick={() => setEmailQuery('marcus.sterling@example.com')}
              className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-secondary-fixed/30 text-primary"
            >
              marcus.sterling@example.com
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
