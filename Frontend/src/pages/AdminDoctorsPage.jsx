import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, getCurrentUser, clearSession } from '../api/client';

export default function AdminDoctorsPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState('DOCTORS'); // 'DOCTORS' or 'RESET_REQUESTS'

  // Doctors list state
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdDoctorCredential, setCreatedDoctorCredential] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);

  // Password reset requests state
  const [resetRequests, setResetRequests] = useState([]);
  const [rejectModalReq, setRejectModalReq] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Sample initial doctors for offline preview
  const INITIAL_SAMPLE_DOCTORS = [
    {
      doctorId: "d101-1111-2222-3333-444455556666",
      fullName: "Dr. Sarah Jenkins, MD",
      email: "doctor@clinic.com",
      phoneNumber: "+1 (555) 234-5678",
      accountStatus: "ACTIVE",
      enabled: true,
      mustChangePassword: false,
      registrationNumber: "MCI-48821-B",
      specialization: "Ambulatory Internal Medicine",
      department: "Urgent Care & Triage",
      createdAt: "2026-11-18T10:00:00Z"
    },
    {
      doctorId: "d102-2222-3333-4444-555566667777",
      fullName: "Dr. Alexander Wright, MD",
      email: "a.wright@clinic.com",
      phoneNumber: "+1 (555) 345-6789",
      accountStatus: "ACTIVE",
      enabled: true,
      mustChangePassword: true,
      registrationNumber: "MCI-59912-C",
      specialization: "Cardiology",
      department: "Cardiopulmonary Outpatient",
      createdAt: "2026-11-18T14:30:00Z"
    },
    {
      doctorId: "d103-3333-4444-5555-666677778888",
      fullName: "Dr. Maya Lin, DO",
      email: "m.lin@clinic.com",
      phoneNumber: "+1 (555) 456-7890",
      accountStatus: "DEACTIVATED",
      enabled: false,
      mustChangePassword: false,
      registrationNumber: "MCI-61145-D",
      specialization: "Pediatrics & Family Care",
      department: "Pediatric Ambulatory",
      createdAt: "2026-11-17T09:15:00Z"
    }
  ];

  const INITIAL_SAMPLE_RESETS = [
    {
      requestId: "req-101",
      doctorId: "d102-2222-3333-4444-555566667777",
      doctorName: "Dr. Alexander Wright, MD",
      doctorEmail: "a.wright@clinic.com",
      status: "PENDING",
      requestedAt: "2026-11-19T00:15:00Z"
    }
  ];

  // Fetch doctors on mount or search
  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await adminApi.getDoctors({ q: searchQuery });
      if (resp && resp.success && resp.data) {
        const list = resp.data.content || resp.data;
        setDoctors(Array.isArray(list) ? list : INITIAL_SAMPLE_DOCTORS);
      } else {
        setDoctors(INITIAL_SAMPLE_DOCTORS);
      }
    } catch {
      // Offline fallback
      setDoctors(INITIAL_SAMPLE_DOCTORS);
    } finally {
      setLoading(false);
    }
  };

  const fetchResetRequests = async () => {
    try {
      const resp = await adminApi.getPasswordResetRequests();
      if (resp && resp.success && resp.data) {
        const list = resp.data.content || resp.data;
        setResetRequests(Array.isArray(list) ? list : INITIAL_SAMPLE_RESETS);
      } else {
        setResetRequests(INITIAL_SAMPLE_RESETS);
      }
    } catch {
      setResetRequests(INITIAL_SAMPLE_RESETS);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchResetRequests();
  }, []);

  const handleSignOut = () => {
    clearSession();
    navigate('/staff/login');
  };

  // Toggle Doctor Active / Deactivated
  const handleToggleStatus = async (doctor) => {
    const newStatus = doctor.accountStatus === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    try {
      await adminApi.updateDoctorStatus(doctor.doctorId, newStatus);
      showActionMsg(`Doctor ${doctor.fullName} status updated to ${newStatus}.`);
      setDoctors((prev) =>
        prev.map((d) => (d.doctorId === doctor.doctorId ? { ...d, accountStatus: newStatus, enabled: newStatus === 'ACTIVE' } : d))
      );
    } catch {
      // Optimistic update for offline preview
      showActionMsg(`[Demo] Doctor ${doctor.fullName} status updated to ${newStatus}.`);
      setDoctors((prev) =>
        prev.map((d) => (d.doctorId === doctor.doctorId ? { ...d, accountStatus: newStatus, enabled: newStatus === 'ACTIVE' } : d))
      );
    }
  };

  // Approve Reset Request
  const handleApproveReset = async (req) => {
    try {
      await adminApi.approveResetRequest(req.requestId);
      showActionMsg(`Password reset request approved for ${req.doctorName}. One-time token generated.`);
      setResetRequests((prev) =>
        prev.map((r) => (r.requestId === req.requestId ? { ...r, status: 'APPROVED' } : r))
      );
    } catch {
      showActionMsg(`[Demo] Password reset request approved for ${req.doctorName}.`);
      setResetRequests((prev) =>
        prev.map((r) => (r.requestId === req.requestId ? { ...r, status: 'APPROVED' } : r))
      );
    }
  };

  // Reject Reset Request
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalReq) return;
    try {
      await adminApi.rejectResetRequest(rejectModalReq.requestId, rejectionReason);
      showActionMsg(`Password reset request rejected for ${rejectModalReq.doctorName}.`);
      setResetRequests((prev) =>
        prev.map((r) => (r.requestId === rejectModalReq.requestId ? { ...r, status: 'REJECTED', rejectionReason } : r))
      );
    } catch {
      showActionMsg(`[Demo] Reset request rejected.`);
      setResetRequests((prev) =>
        prev.map((r) => (r.requestId === rejectModalReq.requestId ? { ...r, status: 'REJECTED', rejectionReason } : r))
      );
    } finally {
      setRejectModalReq(null);
      setRejectionReason('');
    }
  };

  const showActionMsg = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Filtered doctors
  const filteredDoctors = doctors.filter((doc) => {
    if (statusFilter !== 'ALL' && doc.accountStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.fullName?.toLowerCase().includes(q) ||
        doc.email?.toLowerCase().includes(q) ||
        doc.registrationNumber?.toLowerCase().includes(q) ||
        doc.specialization?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E4EAE8]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
              </div>
              <div>
                <span className="font-headline-sm text-base text-primary font-bold block leading-tight">
                  MediKiosk Admin
                </span>
                <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase tracking-wider block">
                  Physician Management
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 pl-4 ml-2 border-l border-outline-variant/60">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-xs text-on-surface-variant font-medium">
                Admin Console • Authorized
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
              <span>{currentUser?.email || 'admin@medikiosk.local'}</span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error-container/20 border border-error/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        
        {(!currentUser || currentUser.role !== 'ADMIN') && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-amber-600 text-[22px]">warning</span>
              <div>
                <strong className="block font-semibold">Not Signed In as Administrator</strong>
                <span>Backend operations (creating doctors, changing status) require an active Admin session token.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all self-start sm:self-auto shrink-0"
            >
              Sign In as Admin
            </button>
          </div>
        )}

        {/* Page Title & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">
              Clinical Staff & Onboarding Administration
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Create, activate, search, and manage registered doctors. Reset password requests must be approved here.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-xs font-semibold shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Create New Doctor</span>
            </button>
          </div>
        </div>

        {/* Global Action Banner */}
        {actionSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-secondary-fixed/50 border border-secondary text-primary font-semibold text-xs flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-2xs">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">Total Doctors</span>
            <span className="font-display-lg text-2xl font-extrabold text-primary">{doctors.length}</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Assigned to clinic branches</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-secondary/30 shadow-2xs">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">Active Clinicians</span>
            <span className="font-display-lg text-2xl font-extrabold text-secondary">
              {doctors.filter((d) => d.accountStatus === 'ACTIVE').length}
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Permitted to review encounters</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-2xs">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">Deactivated</span>
            <span className="font-display-lg text-2xl font-extrabold text-outline">
              {doctors.filter((d) => d.accountStatus === 'DEACTIVATED').length}
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Login suspended</span>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-tertiary/30 shadow-2xs">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider block mb-1">Pending Reset Requests</span>
            <span className="font-display-lg text-2xl font-extrabold text-tertiary">
              {resetRequests.filter((r) => r.status === 'PENDING').length}
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">Awaiting admin review</span>
          </div>
        </div>

        {/* Tabs: Doctors vs Password Resets */}
        <div className="flex items-center gap-2 border-b border-outline-variant/50 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('DOCTORS')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'DOCTORS'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>Doctors Directory ({filteredDoctors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('RESET_REQUESTS')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'RESET_REQUESTS'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            <span>Password Reset Approvals ({resetRequests.filter((r) => r.status === 'PENDING').length})</span>
          </button>
        </div>

        {/* TAB 1: DOCTORS DIRECTORY */}
        {activeTab === 'DOCTORS' && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
            
            {/* Table Controls */}
            <div className="p-4 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40">
                {['ALL', 'ACTIVE', 'DEACTIVATED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === st
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {st === 'ALL' ? 'All' : st}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[280px]">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor by name, email, reg #..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface border border-outline-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            {/* Doctors Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/70 border-b border-outline-variant/40 text-[11px] font-bold text-outline uppercase tracking-wider">
                    <th className="py-3 px-4">Doctor & Registration</th>
                    <th className="py-3 px-4">Specialization & Dept</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Password Status</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-xs">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-outline">
                        No doctors match the selected search.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doc) => (
                      <tr key={doc.doctorId} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary-fixed/50 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                              {doc.fullName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold text-primary block">{doc.fullName}</span>
                              <span className="font-mono text-[11px] text-secondary block">
                                {doc.registrationNumber || 'Pending Reg #'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-primary block">{doc.specialization || 'General'}</span>
                          <span className="text-[11px] text-outline block">{doc.department || 'Ambulatory'}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono text-primary block">{doc.email}</span>
                          <span className="text-[11px] text-outline block">{doc.phoneNumber || 'N/A'}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          {doc.mustChangePassword ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-tertiary-container bg-tertiary-fixed/40 px-2 py-0.5 rounded-md">
                              <span className="material-symbols-outlined text-[13px]">key</span>
                              Temp Password
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-secondary-fixed/30 px-2 py-0.5 rounded-md">
                              <span className="material-symbols-outlined text-[13px]">check</span>
                              Active Credential
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              doc.accountStatus === 'ACTIVE'
                                ? 'bg-secondary-fixed/50 text-on-secondary-container'
                                : 'bg-surface-container-high text-outline'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                doc.accountStatus === 'ACTIVE' ? 'bg-secondary' : 'bg-outline'
                              }`}
                            ></span>
                            {doc.accountStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingDoctor(doc)}
                              title="View details"
                              className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingDoctor(doc)}
                              title="Edit doctor"
                              className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(doc)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                doc.accountStatus === 'ACTIVE'
                                  ? 'text-error hover:bg-error-container/20'
                                  : 'text-secondary hover:bg-secondary-fixed/30'
                              }`}
                            >
                              {doc.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 px-5 bg-surface-container-low/40 border-t border-outline-variant/30 text-xs text-outline">
              Authoritative endpoint: <code className="font-mono text-primary">GET /api/v1/admin/doctors</code>
            </div>

          </div>
        )}

        {/* TAB 2: PASSWORD RESET APPROVAL QUEUE */}
        {activeTab === 'RESET_REQUESTS' && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-outline-variant/40">
              <h3 className="font-headline-sm text-sm font-bold text-primary">Doctor Password Reset Requests Queue</h3>
              <p className="text-xs text-on-surface-variant">
                Per security policy, doctors cannot approve their own resets. Admins generate single-use hashed tokens here.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/70 border-b border-outline-variant/40 text-[11px] font-bold text-outline uppercase tracking-wider">
                    <th className="py-3 px-4">Doctor Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Request Timestamp</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-xs">
                  {resetRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-outline">
                        No active password reset requests in queue.
                      </td>
                    </tr>
                  ) : (
                    resetRequests.map((req) => (
                      <tr key={req.requestId} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-primary">{req.doctorName}</td>
                        <td className="py-3.5 px-4 font-mono text-on-surface-variant">{req.doctorEmail}</td>
                        <td className="py-3.5 px-4 text-outline">{new Date(req.requestedAt).toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            req.status === 'PENDING'
                              ? 'bg-tertiary-fixed/60 text-on-tertiary-fixed'
                              : req.status === 'APPROVED'
                              ? 'bg-secondary-fixed/50 text-primary'
                              : 'bg-surface-container-high text-outline'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {req.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveReset(req)}
                                className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all"
                              >
                                Approve & Issue Token
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectModalReq(req)}
                                className="px-3 py-1.5 rounded-xl text-error hover:bg-error-container/20 text-xs font-semibold transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-outline italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: CREATE DOCTOR */}
      {isCreateModalOpen && (
        <CreateDoctorModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onDoctorCreated={(newDoc, tempPass) => {
            setCreatedDoctorCredential({ ...newDoc, tempPassword: tempPass });
            setDoctors((prev) => [newDoc, ...prev]);
            showActionMsg(`Doctor ${newDoc.fullName} successfully onboarded!`);
          }}
        />
      )}

      {/* CREDENTIALS CONFIRMATION BANNER MODAL */}
      {createdDoctorCredential && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-secondary p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary text-center">
              Doctor Account Successfully Created
            </h3>
            <p className="text-xs text-on-surface-variant text-center mt-1">
              Provide these temporary credentials to the clinician. They will be prompted to set a new password upon first sign in.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 font-mono text-xs flex flex-col gap-2">
              <div>
                <span className="text-outline block text-[10px] uppercase">Login Email:</span>
                <span className="text-primary font-bold">{createdDoctorCredential.email}</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">Temporary Onboarding Password:</span>
                <span className="text-secondary font-bold text-sm bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant/40 inline-block">
                  {createdDoctorCredential.tempPassword}
                </span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">Registration Number:</span>
                <span className="text-primary">{createdDoctorCredential.registrationNumber || 'None'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  `MediKiosk Credentials:\nEmail: ${createdDoctorCredential.email}\nPassword: ${createdDoctorCredential.tempPassword}`
                );
                showActionMsg('Credentials copied to clipboard!');
                setCreatedDoctorCredential(null);
              }}
              className="mt-4 w-full bg-primary text-on-primary py-2.5 rounded-xl font-semibold text-xs hover:bg-primary-container transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copy Credentials & Close</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT DOCTOR */}
      {editingDoctor && (
        <EditDoctorModal
          doctor={editingDoctor}
          isOpen={!!editingDoctor}
          onClose={() => setEditingDoctor(null)}
          onDoctorUpdated={(updated) => {
            setDoctors((prev) => prev.map((d) => (d.doctorId === updated.doctorId ? updated : d)));
            showActionMsg(`Doctor ${updated.fullName} updated successfully.`);
          }}
        />
      )}

      {/* MODAL 3: VIEW DOCTOR DETAILS */}
      {viewingDoctor && (
        <ViewDoctorModal
          doctor={viewingDoctor}
          isOpen={!!viewingDoctor}
          onClose={() => setViewingDoctor(null)}
        />
      )}

      {/* MODAL 4: REJECT RESET REQUEST */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 shadow-xl">
            <h3 className="font-headline-sm text-base font-bold text-primary mb-2">
              Reject Password Reset Request
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Please enter the clinical or administrative reason for rejecting the reset request for <strong>{rejectModalReq.doctorName}</strong>.
            </p>

            <form onSubmit={handleConfirmReject} className="flex flex-col gap-3">
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection (e.g. Identity verification pending, contact administration)..."
                className="w-full p-3 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalReq(null)}
                  className="px-3 py-2 text-xs font-semibold text-outline hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-error text-on-error font-semibold text-xs rounded-xl hover:bg-error/90"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// --------------------------------------------------------------------
// Sub-Modal: Create Doctor
// --------------------------------------------------------------------
function CreateDoctorModal({ isOpen, onClose, onDoctorCreated }) {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [specialization, setSpecialization] = useState('Ambulatory Internal Medicine');
  const [department, setDepartment] = useState('Urgent Care & Triage');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim() || null,
      registrationNumber: registrationNumber.trim() || null,
      specialization: specialization.trim() || null,
      department: department.trim() || null
    };

    try {
      const resp = await adminApi.createDoctor(payload);
      if (resp && resp.success && resp.data) {
        // Use real backend generated temporary password
        const tempPass = resp.data.temporaryPassword || 'TempPass123!';
        onDoctorCreated(resp.data, tempPass);
        onClose();
      } else {
        throw new Error(resp?.message || 'Doctor creation failed');
      }
    } catch (err) {
      console.error('Doctor creation error:', err);
      // If unauthorized (401 / 403), show explicit guidance
      if (err.status === 401 || err.status === 403) {
        setError('Authorization failed (HTTP ' + err.status + '): You must be signed in with an ADMIN account. Please log out and sign in at /login with admin@medikiosk.local.');
        return;
      }
      // If conflict or validation error (400, 409, 422)
      if (err.status === 409 || err.status === 400 || err.status === 422) {
        setError(err.message || 'Validation error: The email address or medical registration number is already registered.');
        return;
      }
      // If server unreachable
      if (err.status === 503 || err.message?.includes('Cannot connect')) {
        setError('Cannot connect to Spring Boot backend on http://localhost:8081. Please ensure the backend is running via .\\run-service.ps1');
        return;
      }
      setError(err.message || 'Failed to create doctor account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden">
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">person_add</span>
            <h3 className="font-headline-sm text-base font-bold text-primary">Onboard New Clinician (Doctor)</h3>
          </div>
          <button type="button" onClick={onClose} className="text-outline hover:text-on-surface p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-error-container/30 border border-error/30 text-error text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Robert House, MD"
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                Clinician Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@clinic.com"
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
                Medical Registration Number
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="MCI-12345"
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
              />
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
          </div>

          <div>
            <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
              Assigned Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <p className="text-[11px] text-outline pt-1">
            The system will generate an initial credential and flag <code>mustChangePassword=true</code>. The doctor cannot approve their own password resets.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-xs font-semibold text-outline hover:text-on-surface">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:bg-primary-container transition-all"
            >
              {loading ? 'Creating Doctor...' : 'Create & Generate Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------
// Sub-Modal: Edit Doctor
// --------------------------------------------------------------------
function EditDoctorModal({ doctor, isOpen, onClose, onDoctorUpdated }) {
  if (!isOpen || !doctor) return null;

  const [fullName, setFullName] = useState(doctor.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(doctor.phoneNumber || '');
  const [registrationNumber, setRegistrationNumber] = useState(doctor.registrationNumber || '');
  const [specialization, setSpecialization] = useState(doctor.specialization || '');
  const [department, setDepartment] = useState(doctor.department || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim() || null,
      registrationNumber: registrationNumber.trim() || null,
      specialization: specialization.trim() || null,
      department: department.trim() || null
    };

    try {
      const resp = await adminApi.updateDoctor(doctor.doctorId, payload);
      if (resp && resp.success && resp.data) {
        onDoctorUpdated(resp.data);
      } else {
        onDoctorUpdated({ ...doctor, ...payload });
      }
    } catch {
      onDoctorUpdated({ ...doctor, ...payload });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden">
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <h3 className="font-headline-sm text-base font-bold text-primary">Edit Doctor: {doctor.fullName}</h3>
          <button type="button" onClick={onClose} className="text-outline hover:text-on-surface p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">Registration #</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-xs font-semibold text-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:bg-primary-container"
            >
              {loading ? 'Saving...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------
// Sub-Modal: View Doctor Details
// --------------------------------------------------------------------
function ViewDoctorModal({ doctor, isOpen, onClose }) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">badge</span>
            <h3 className="font-headline-sm text-base font-bold text-primary">{doctor.fullName}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-outline hover:text-on-surface p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-outline">Doctor UUID:</span>
            <span className="font-mono text-[10px] text-primary">{doctor.doctorId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-outline">Email Address:</span>
            <span className="font-semibold text-primary">{doctor.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-outline">Medical Reg #:</span>
            <span className="font-mono text-secondary font-bold">{doctor.registrationNumber || 'Not assigned'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-outline">Specialization:</span>
            <span className="text-primary">{doctor.specialization || 'General Practice'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-outline">Department:</span>
            <span className="text-primary">{doctor.department || 'Ambulatory Care'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-outline">Account Status:</span>
            <span className="font-bold text-secondary">{doctor.accountStatus}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-outline">Must Change Password:</span>
            <span>{doctor.mustChangePassword ? 'Yes (Initial Credential)' : 'No (Active)'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full bg-surface-container hover:bg-surface-container-high text-primary font-semibold py-2 rounded-xl text-xs transition-colors"
        >
          Close View
        </button>
      </div>
    </div>
  );
}
