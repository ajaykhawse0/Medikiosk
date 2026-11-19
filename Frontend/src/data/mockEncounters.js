export const INITIAL_ENCOUNTERS = [
  {
    id: "ENC-8842",
    patientName: "Jane Doe",
    dob: "1982-10-14",
    gender: "Female",
    age: 44,
    email: "jane.doe@example.com",
    sessionSource: "Kiosk #02 (Ambulatory Reception)",
    checkinTime: "10:34 AM",
    timeAgo: "8 mins ago",
    status: "READY_FOR_REVIEW", // READY_FOR_REVIEW, UNDER_REVIEW, REVIEWED, FLAGGED
    triageTier: "Tier 3", // Tier 1: Immediate, Tier 2: Urgent, Tier 3: Routine
    triageLabel: "Routine Ambulatory",
    urgencyColor: "border-secondary text-secondary",
    chiefComplaint: "Productive cough and fatigue ongoing for 4 days. Denies chest pain or shortness of breath at rest.",
    discomfortIndex: 4,
    alerts: [
      { type: "ALLERGY", text: "Penicillin Allergy (Severe Anaphylaxis)", severity: "critical" },
      { type: "VITAL", text: "Low-Grade Temperature (38.1°C / 100.6°F)", severity: "warning" }
    ],
    answers: [
      { question: "Primary Reason for Consultation", answer: "Acute respiratory and chest discomfort" },
      { question: "Symptom Onset & Duration", answer: "Began 4 days ago after seasonal weather change" },
      { question: "Current Medications", answer: "Loratadine 10mg daily, Albuterol inhaler PRN" },
      { question: "Known Medical Conditions", answer: "Mild intermittent asthma, seasonal allergic rhinitis" },
      { question: "Smoking / Tobacco History", answer: "Never smoker" }
    ],
    documents: [
      { id: "DOC-101", name: "Vaccination_Record_2025.pdf", size: "1.2 MB", type: "PDF", verified: true },
      { id: "DOC-102", name: "Prior_Chest_XRay_Report.pdf", size: "2.8 MB", type: "PDF", verified: true }
    ],
    clinicalNotes: ""
  },
  {
    id: "ENC-8841",
    patientName: "Marcus Sterling",
    dob: "1975-04-22",
    gender: "Male",
    age: 51,
    email: "marcus.sterling@example.com",
    sessionSource: "Mobile PWA Check-In (QR Code)",
    checkinTime: "10:15 AM",
    timeAgo: "27 mins ago",
    status: "UNDER_REVIEW",
    triageTier: "Tier 2",
    triageLabel: "Urgent Observation",
    urgencyColor: "border-tertiary-container text-tertiary-container",
    chiefComplaint: "Sudden onset localized right lower quadrant abdominal pain with nausea.",
    discomfortIndex: 7,
    alerts: [
      { type: "URGENT", text: "Elevated Discomfort Index (7 / 10)", severity: "critical" },
      { type: "ALLERGY", text: "Sulfa Drug Sensitivity", severity: "warning" }
    ],
    answers: [
      { question: "Primary Reason for Consultation", answer: "Abdominal pain and acute tenderness" },
      { question: "Symptom Onset & Duration", answer: "Started approximately 6 hours ago, progressively worsening" },
      { question: "Current Medications", answer: "Atorvastatin 20mg nightly" },
      { question: "Prior Surgeries", answer: "None" }
    ],
    documents: [
      { id: "DOC-103", name: "Insurance_Card_Front_Back.jpg", size: "3.4 MB", type: "IMAGE", verified: true }
    ],
    clinicalNotes: "Patient flagged for preliminary ultrasound consult by Dr. Jenkins."
  },
  {
    id: "ENC-8840",
    patientName: "Priya Sharma",
    dob: "1993-08-30",
    gender: "Female",
    age: 33,
    email: "priya.sharma@example.com",
    sessionSource: "Kiosk #01 (Main Lobby)",
    checkinTime: "09:55 AM",
    timeAgo: "47 mins ago",
    status: "READY_FOR_REVIEW",
    triageTier: "Tier 3",
    triageLabel: "Routine Checkup",
    urgencyColor: "border-secondary text-secondary",
    chiefComplaint: "Routine annual preventive health assessment and fasting metabolic bloodwork renewal.",
    discomfortIndex: 1,
    alerts: [
      { type: "INFO", text: "Fasting since 10:00 PM previous evening", severity: "info" }
    ],
    answers: [
      { question: "Primary Reason for Consultation", answer: "Annual checkup and wellness labs" },
      { question: "Recent Health Changes", answer: "No acute changes. Occasional work-related tension headaches." },
      { question: "Family History", answer: "Type 2 diabetes (maternal), Hypertension (paternal)" }
    ],
    documents: [
      { id: "DOC-104", name: "Previous_Lab_Panel_2025.pdf", size: "1.8 MB", type: "PDF", verified: true }
    ],
    clinicalNotes: ""
  },
  {
    id: "ENC-8839",
    patientName: "Robert Vance",
    dob: "1960-12-05",
    gender: "Male",
    age: 65,
    email: "robert.vance@example.com",
    sessionSource: "Kiosk #03 (Cardiology Wing)",
    checkinTime: "09:20 AM",
    timeAgo: "1 hr ago",
    status: "REVIEWED",
    triageTier: "Tier 3",
    triageLabel: "Chronic Disease Management",
    urgencyColor: "border-secondary text-secondary",
    chiefComplaint: "Routine hypertension and hyperlipidemia quarterly follow-up. Blood pressure logs uploaded.",
    discomfortIndex: 2,
    alerts: [
      { type: "MEDICATION", text: "Active Anticoagulant: Apixaban 5mg BID", severity: "warning" }
    ],
    answers: [
      { question: "Home BP Average (Past 7 Days)", answer: "128/82 mmHg taken mornings" },
      { question: "Current Medications", answer: "Lisinopril 10mg, Apixaban 5mg, Metoprolol 25mg" },
      { question: "Side Effects Reported", answer: "Mild dizziness upon sudden standing" }
    ],
    documents: [
      { id: "DOC-105", name: "Home_BP_Log_November2026.pdf", size: "0.9 MB", type: "PDF", verified: true }
    ],
    clinicalNotes: "Chart approved. Prescriptions refilled for 90 days. Next review scheduled for Feb 2027."
  },
  {
    id: "ENC-8838",
    patientName: "Elena Rostova",
    dob: "1988-06-18",
    gender: "Female",
    age: 38,
    email: "elena.rostova@example.com",
    sessionSource: "Kiosk #02 (Ambulatory Reception)",
    checkinTime: "08:45 AM",
    timeAgo: "2 hrs ago",
    status: "REVIEWED",
    triageTier: "Tier 3",
    triageLabel: "Dermatology Triage",
    urgencyColor: "border-secondary text-secondary",
    chiefComplaint: "Pruritic erythematous rash across bilateral forearms following new topical moisturizer use.",
    discomfortIndex: 3,
    alerts: [
      { type: "ALLERGY", text: "Contact Dermatitis / Fragrance Allergy", severity: "warning" }
    ],
    answers: [
      { question: "Duration of Symptoms", answer: "3 days" },
      { question: "Previous Treatments Tried", answer: "OTC Hydrocortisone 1% cream with minimal relief" }
    ],
    documents: [
      { id: "DOC-106", name: "Forearm_Skin_Rash_Image.jpg", size: "4.1 MB", type: "IMAGE", verified: true }
    ],
    clinicalNotes: "Prescribed topical triamcinolone 0.1%. Discontinue offending skin product."
  }
];
