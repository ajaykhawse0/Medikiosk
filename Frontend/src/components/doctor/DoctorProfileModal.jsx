import React, { useState } from 'react';

export default function DoctorProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('Dr. Sarah Jenkins, MD');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-5678');
  const [specialization, setSpecialization] = useState('Ambulatory Internal Medicine');
  const [department, setDepartment] = useState('Urgent Care & Triage');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
            <h3 className="font-headline-sm text-base font-bold text-primary">Doctor Profile & Credentials</h3>
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
          {savedMessage && (
            <div className="mb-4 p-3 bg-secondary-fixed/50 text-primary text-xs font-semibold rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
              <span>Profile details updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary text-primary font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  disabled
                  value="MCI-48821-B"
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs text-outline cursor-not-allowed font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                Assigned Clinical Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <p className="text-[11px] text-outline pt-1">
              Note: Registration number is administrator-managed and cannot be altered by clinicians.
            </p>

            <button
              type="submit"
              className="mt-2 w-full bg-primary text-on-primary py-2.5 rounded-xl font-semibold text-xs hover:bg-primary-container transition-colors shadow-2xs"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
