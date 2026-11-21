import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorNavbar from '../components/doctor/DoctorNavbar';
import EncounterMetrics from '../components/doctor/EncounterMetrics';
import EncounterQueueTable from '../components/doctor/EncounterQueueTable';
import EncounterDetailModal from '../components/doctor/EncounterDetailModal';
import PatientSearchModal from '../components/doctor/PatientSearchModal';
import DoctorProfileModal from '../components/doctor/DoctorProfileModal';
import DoctorResetPasswordModal from '../components/doctor/DoctorResetPasswordModal';
import { INITIAL_ENCOUNTERS } from '../data/mockEncounters';
import { getCurrentUser, clearSession, doctorApi } from '../api/client';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [doctorProfile, setDoctorProfile] = useState(null);

  const [encounters, setEncounters] = useState(INITIAL_ENCOUNTERS);
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Load session user and live doctor profile
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    doctorApi.getProfile()
      .then((resp) => {
        if (resp && resp.success && resp.data) {
          setDoctorProfile(resp.data);
        }
      })
      .catch(() => {
        // Retain session user data if backend offline
      });
  }, []);

  // Compute live clinician display name from login session or profile
  const rawName = doctorProfile?.fullName || currentUser?.name || currentUser?.fullName || 'Clinician';
  const doctorDisplayName = rawName.toLowerCase().startsWith('dr.') ? rawName : `Dr. ${rawName}`;
  const doctorDepartment = doctorProfile?.department || doctorProfile?.specialization || 'Ambulatory & Urgent Care';

  // Update encounter status and clinical notes
  const handleUpdateStatus = (encounterId, newStatus, clinicalNote) => {
    setEncounters((prev) =>
      prev.map((enc) =>
        enc.id === encounterId
          ? {
              ...enc,
              status: newStatus,
              clinicalNotes: clinicalNote || enc.clinicalNotes
            }
          : enc
      )
    );
  };

  // Open detail modal when a patient is selected from search
  const handleSelectPatientEncounter = (encounterId) => {
    const found = encounters.find((e) => e.id === encounterId);
    if (found) {
      setSelectedEncounter(found);
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      
      {/* Top Navbar with dynamic login name and initials */}
      <DoctorNavbar
        doctor={{
          name: doctorDisplayName,
          role: currentUser?.role || 'DOCTOR',
          department: doctorDepartment,
          email: doctorProfile?.email || currentUser?.email || ''
        }}
        onOpenPatientSearch={() => setIsPatientSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenResetPassword={() => setIsResetPasswordOpen(true)}
        onLogout={() => {
          clearSession();
          navigate('/login');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        
        {/* Welcome & Shift Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">
              Welcome, {doctorDisplayName}
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Review and approve structured patient intake submissions before examination.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-semibold text-primary">
              <span className="material-symbols-outlined text-[16px] text-secondary">domain</span>
              Clinic: {doctorDepartment}
            </span>

            <button
              type="button"
              onClick={() => setIsPatientSearchOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Find Patient</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics Cards */}
        <EncounterMetrics encounters={encounters} />

        {/* Filterable Encounter Queue Table */}
        <EncounterQueueTable
          encounters={encounters}
          onSelectEncounter={(enc) => setSelectedEncounter(enc)}
        />

      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 py-4 px-6 text-center text-xs text-outline">
        MediKiosk Clinical Review System • Authoritative records stored in PostgreSQL & verified against PRD constraints
      </footer>

      {/* Interactive Detail & Action Drawer */}
      <EncounterDetailModal
        encounter={selectedEncounter}
        isOpen={!!selectedEncounter}
        onClose={() => setSelectedEncounter(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Audited Patient Search Modal */}
      <PatientSearchModal
        isOpen={isPatientSearchOpen}
        onClose={() => setIsPatientSearchOpen(false)}
        onSelectPatientEncounter={handleSelectPatientEncounter}
      />

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        isOpen={isProfileOpen}
        profile={doctorProfile || { fullName: doctorDisplayName, department: doctorDepartment }}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={(updated) => {
          setDoctorProfile(updated);
        }}
      />

      {/* Doctor Password Reset Modal */}
      <DoctorResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />

    </div>
  );
}
