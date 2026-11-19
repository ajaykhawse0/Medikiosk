import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import HeroSection from '../components/landing/HeroSection';
import TrustHighlightsSection from '../components/landing/TrustHighlightsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ClinicianWorkspaceSection from '../components/landing/ClinicianWorkspaceSection';
import IntakeCtaSection from '../components/landing/IntakeCtaSection';
import LandingFooter from '../components/landing/LandingFooter';
import StaffLoginModal from '../components/modals/StaffLoginModal';
import PatientIntakeModal from '../components/modals/PatientIntakeModal';

export default function LandingPage({ defaultLoginOpen = false }) {
  const navigate = useNavigate();
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(defaultLoginOpen);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  const handleLoginSuccess = (userSession) => {
    setActiveSession(userSession);
    if (userSession.accessToken) {
      localStorage.setItem('medikiosk_token', userSession.accessToken);
      localStorage.setItem('medikiosk_user', JSON.stringify(userSession));
    }
    // Navigate to doctor dashboard
    navigate('/doctor');
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Fixed Navigation Header */}
      <LandingHeader
        onStaffLogin={() => setIsStaffLoginOpen(true)}
        onStartIntake={() => setIsIntakeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 bg-surface flex-1">
        <HeroSection
          onStartIntake={() => setIsIntakeOpen(true)}
          onStaffLogin={() => setIsStaffLoginOpen(true)}
        />
        <TrustHighlightsSection />
        <HowItWorksSection />
        <FeaturesSection />
        {/* <ClinicianWorkspaceSection
          onStaffLogin={() => setIsStaffLoginOpen(true)}
        /> */}
        <IntakeCtaSection
          onStartIntake={() => setIsIntakeOpen(true)}
        />
      </main>

      {/* Footer */}
      <LandingFooter
        onStaffLogin={() => setIsStaffLoginOpen(true)}
      />

      {/* Interactive Modals */}
      <StaffLoginModal
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <PatientIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
      />
    </div>
  );
}
