import {
  User,
  UserDocument,
  Application,
  FamilyMember,
  Service,
  ApplicationStep,
} from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Days until expiry from today (not hardcoded). Negative = already expired. */
export function daysUntilExpiry(dateStr: string): number {
  const expiry = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/** Format a date string to "DD MMM YYYY" */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── User ─────────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: 'user-001',
  name: 'Arjun Sharma',
  phone: '+91 98765 43210',
  location: 'Jaipur',
  state: 'Rajasthan',
};

// ─── Documents ────────────────────────────────────────────────────────────────
// NOTE: Dates are relative to today so the app always shows live urgency.
// We use fixed calendar dates for some and dynamically offset others.

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysAgo(days: number): string {
  return daysFromNow(-days);
}

export const mockDocuments: UserDocument[] = [
  {
    id: 'doc-001',
    ownerId: 'user-001',
    type: 'driving_licence',
    title: 'Driving Licence',
    issuer: 'Transport Authority, Rajasthan',
    status: 'expiring',
    issueDate: daysAgo(365 * 5),
    expiryDate: daysFromNow(22),       // 22 days left — urgentMedium
    verified: true,
    documentNumber: 'RJ-14 20210012345',
  },
  {
    id: 'doc-002',
    ownerId: 'user-001',
    type: 'aadhaar',
    title: 'Aadhaar Card',
    issuer: 'UIDAI',
    status: 'active',
    issueDate: daysAgo(365 * 6),
    expiryDate: null,
    verified: true,
    documentNumber: 'XXXX XXXX 4321',
  },
  {
    id: 'doc-003',
    ownerId: 'user-001',
    type: 'pan',
    title: 'PAN Card',
    issuer: 'Income Tax Department',
    status: 'active',
    issueDate: daysAgo(365 * 8),
    expiryDate: null,
    verified: true,
    documentNumber: 'ABCDE1234F',
  },
  {
    id: 'doc-004',
    ownerId: 'user-001',
    type: 'voter_id',
    title: 'Voter ID',
    issuer: 'Election Commission of India',
    status: 'active',
    issueDate: daysAgo(365 * 5),
    expiryDate: null,
    verified: true,
    documentNumber: 'RJC1234567',
  },
  {
    id: 'doc-005',
    ownerId: 'user-001',
    type: 'income_certificate',
    title: 'Income Certificate',
    issuer: 'Revenue Department, Rajasthan',
    status: 'expiring',
    issueDate: daysAgo(330),
    expiryDate: daysFromNow(35),       // 35 days — urgentLow
    verified: true,
    documentNumber: 'RC-JR-2025-00872',
  },
  {
    id: 'doc-006',
    ownerId: 'user-001',
    type: 'address_proof',
    title: 'Residence Certificate',
    issuer: 'Municipal Corporation, Jaipur',
    status: 'active',
    issueDate: daysAgo(180),
    expiryDate: daysFromNow(185),
    verified: true,
    documentNumber: 'MC-JR-2023-4455',
  },
  {
    id: 'doc-007',
    ownerId: 'user-001',
    type: 'birth_certificate',
    title: 'Birth Certificate',
    issuer: 'Municipal Corporation, Jaipur',
    status: 'active',
    issueDate: '1995-09-15',
    expiryDate: null,
    verified: true,
    documentNumber: 'BC-JR-1995-7890',
  },
  {
    id: 'doc-008',
    ownerId: 'user-001',
    type: 'passport',
    title: 'Passport',
    issuer: 'Ministry of External Affairs',
    status: 'needs_correction',
    issueDate: daysAgo(365 * 3),
    expiryDate: daysFromNow(365 * 7),
    verified: false,
    documentNumber: 'Z1234567',
  },
  {
    id: 'doc-009',
    ownerId: 'user-001',
    type: 'voter_id',
    title: 'Voter ID Card',
    issuer: 'Election Commission of India',
    status: 'active',
    issueDate: daysAgo(365 * 4),
    expiryDate: null,
    verified: true,
    documentNumber: 'RJF9876012',
  },
  {
    id: 'doc-010',
    ownerId: 'user-001',
    type: 'caste_certificate',
    title: 'State Caste Certificate',
    issuer: 'Revenue Department, Rajasthan',
    status: 'active',
    issueDate: daysAgo(365 * 2),
    expiryDate: null,
    verified: true,
    documentNumber: 'CC-RJ-2022-9876',
  },
];

// ─── Applications ──────────────────────────────────────────────────────────────

const licenceRenewalSteps: ApplicationStep[] = [
  { id: 1, label: 'Submitted',         completed: true,  active: false },
  { id: 2, label: 'Documents checked', completed: true,  active: false },
  { id: 3, label: 'Verification',      completed: false, active: true  },
  { id: 4, label: 'Licence issued',    completed: false, active: false },
];

const incomeSteps: ApplicationStep[] = [
  { id: 1, label: 'Submitted',          completed: true,  active: false },
  { id: 2, label: 'Documents verified', completed: true,  active: false },
  { id: 3, label: 'Officer review',     completed: false, active: true  },
  { id: 4, label: 'Certificate issued', completed: false, active: false },
];

const residenceSteps: ApplicationStep[] = [
  { id: 1, label: 'Draft saved', completed: true,  active: false },
  { id: 2, label: 'Documents',   completed: false, active: true  },
  { id: 3, label: 'Review',      completed: false, active: false },
  { id: 4, label: 'Submit',      completed: false, active: false },
];

export const mockApplications: Application[] = [
  {
    id: 'app-001',
    ownerId: 'user-001',
    service: 'Driving Licence Renewal',
    serviceId: 'svc-001',
    status: 'in_progress',
    progress: 3,
    totalSteps: 4,
    nextAction: 'Awaiting verification — no action required',
    submittedDate: daysAgo(5),
    updatedDate: daysAgo(3),
    steps: licenceRenewalSteps,
    estimatedDays: '3–5 business days',
  },
  {
    id: 'app-002',
    ownerId: 'user-001',
    service: 'Income Certificate',
    serviceId: 'svc-002',
    status: 'in_progress',
    progress: 3,
    totalSteps: 4,
    nextAction: 'Officer review in progress — usually takes 7–10 days',
    submittedDate: daysAgo(8),
    updatedDate: daysAgo(2),
    steps: incomeSteps,
    estimatedDays: '7–10 business days',
  },
  {
    id: 'app-003',
    ownerId: 'user-001',
    service: 'Residence Certificate',
    serviceId: 'svc-003',
    status: 'draft',
    progress: 1,
    totalSteps: 4,
    nextAction: 'Continue — you need 1 more document',
    submittedDate: null,
    updatedDate: daysAgo(1),
    steps: residenceSteps,
    estimatedDays: '5–7 business days',
  },
  {
    id: 'app-004',
    ownerId: 'user-001',
    service: 'PAN Card',
    serviceId: 'svc-legacy',
    status: 'completed',
    progress: 4,
    totalSteps: 4,
    nextAction: 'Document issued',
    submittedDate: daysAgo(365 * 8),
    updatedDate: daysAgo(365 * 8 - 15),
    steps: [],
    estimatedDays: '',
  },
  {
    id: 'app-005',
    ownerId: 'user-001',
    service: 'Passport Application',
    serviceId: 'svc-004',
    status: 'in_progress',
    progress: 2,
    totalSteps: 5,
    nextAction: 'Visit POPSK Churu for biometric capture on 15 Apr 2023 at 2:45 PM',
    submittedDate: daysAgo(14),
    updatedDate: daysAgo(2),
    steps: [
      { id: 1, label: 'Submitted',          completed: true,  active: false },
      { id: 2, label: 'Fee paid',           completed: true,  active: false },
      { id: 3, label: 'Appointment Scheduled', completed: false, active: true },
      { id: 4, label: 'Police Verification',   completed: false, active: false },
      { id: 5, label: 'Passport Dispatched',   completed: false, active: false },
    ],
    estimatedDays: '15-20 business days',
  },
];

// ─── Family Members ────────────────────────────────────────────────────────────

export const mockFamily: FamilyMember[] = [
  {
    id: 'fam-001',
    name: 'Sunita Sharma',
    relationship: 'mother',
    documents: [
      { id: 'fdoc-001', ownerId: 'fam-001', type: 'aadhaar',           title: 'Aadhaar Card',        issuer: 'UIDAI',                       status: 'active',           issueDate: daysAgo(365*7),   expiryDate: null,              verified: true,  documentNumber: 'XXXX XXXX 8765' },
      { id: 'fdoc-002', ownerId: 'fam-001', type: 'pan',               title: 'PAN Card',            issuer: 'Income Tax Department',        status: 'active',           issueDate: daysAgo(365*14),  expiryDate: null,              verified: true,  documentNumber: 'FGHIJ5678K' },
      { id: 'fdoc-003', ownerId: 'fam-001', type: 'pension',           title: 'Pension Document',    issuer: 'State Finance Department',     status: 'active',           issueDate: daysAgo(365*4),   expiryDate: null,              verified: true,  documentNumber: 'PEN-RJ-2020-3344' },
      { id: 'fdoc-004', ownerId: 'fam-001', type: 'voter_id',          title: 'Voter ID',            issuer: 'Election Commission of India', status: 'active',           issueDate: daysAgo(365*19),  expiryDate: null,              verified: true,  documentNumber: 'RJD5678901' },
      { id: 'fdoc-005', ownerId: 'fam-001', type: 'address_proof',     title: 'Address Certificate', issuer: 'Municipal Corporation, Jaipur',status: 'expiring',         issueDate: daysAgo(330),     expiryDate: daysFromNow(35),   verified: true,  documentNumber: 'MC-JR-2023-9900' },
      { id: 'fdoc-006', ownerId: 'fam-001', type: 'medical',           title: 'Medical Certificate', issuer: 'SMS Hospital, Jaipur',          status: 'active',           issueDate: daysAgo(60),      expiryDate: daysFromNow(305),  verified: true,  documentNumber: 'SMS-2026-11223' },
      { id: 'fdoc-007', ownerId: 'fam-001', type: 'birth_certificate', title: 'Birth Certificate',   issuer: 'Municipal Corporation',        status: 'active',           issueDate: '1960-06-10',     expiryDate: null,              verified: true,  documentNumber: 'BC-JR-1960-0012' },
      { id: 'fdoc-008', ownerId: 'fam-001', type: 'income_certificate',title: 'Income Certificate',  issuer: 'Revenue Department',           status: 'expiring',         issueDate: daysAgo(330),     expiryDate: daysFromNow(35),   verified: true,  documentNumber: 'RC-JR-2025-00311' },
    ],
  },
  {
    id: 'fam-002',
    name: 'Ramesh Sharma',
    relationship: 'father',
    documents: [
      { id: 'fdoc-009', ownerId: 'fam-002', type: 'aadhaar',           title: 'Aadhaar Card',        issuer: 'UIDAI',                       status: 'active',           issueDate: daysAgo(365*7),   expiryDate: null,              verified: true,  documentNumber: 'XXXX XXXX 1122' },
      { id: 'fdoc-010', ownerId: 'fam-002', type: 'pan',               title: 'PAN Card',            issuer: 'Income Tax Department',        status: 'active',           issueDate: daysAgo(365*16),  expiryDate: null,              verified: true,  documentNumber: 'LMNOP9012Q' },
      { id: 'fdoc-011', ownerId: 'fam-002', type: 'driving_licence',   title: 'Driving Licence',     issuer: 'Transport Authority',          status: 'expired',          issueDate: daysAgo(365*14),  expiryDate: daysAgo(200),      verified: false, documentNumber: 'RJ-14 20100056789' },
      { id: 'fdoc-012', ownerId: 'fam-002', type: 'voter_id',          title: 'Voter ID',            issuer: 'Election Commission',          status: 'active',           issueDate: daysAgo(365*24),  expiryDate: null,              verified: true,  documentNumber: 'RJE1234560' },
      { id: 'fdoc-013', ownerId: 'fam-002', type: 'pension',           title: 'Pension Document',    issuer: 'State Finance Department',     status: 'active',           issueDate: daysAgo(365*9),   expiryDate: null,              verified: true,  documentNumber: 'PEN-RJ-2015-6677' },
      { id: 'fdoc-014', ownerId: 'fam-002', type: 'birth_certificate', title: 'Birth Certificate',   issuer: 'Municipal Corporation',        status: 'active',           issueDate: '1958-11-20',     expiryDate: null,              verified: true,  documentNumber: 'BC-JR-1958-0034' },
    ],
  },
  {
    id: 'fam-003',
    name: 'Priya Sharma',
    relationship: 'spouse',
    documents: [
      { id: 'fdoc-015', ownerId: 'fam-003', type: 'aadhaar',           title: 'Aadhaar Card',        issuer: 'UIDAI',                       status: 'active',           issueDate: daysAgo(365*5),   expiryDate: null,              verified: true,  documentNumber: 'XXXX XXXX 5566' },
      { id: 'fdoc-016', ownerId: 'fam-003', type: 'pan',               title: 'PAN Card',            issuer: 'Income Tax Department',        status: 'active',           issueDate: daysAgo(365*9),   expiryDate: null,              verified: true,  documentNumber: 'RSTUV3456W' },
      { id: 'fdoc-017', ownerId: 'fam-003', type: 'driving_licence',   title: 'Driving Licence',     issuer: 'Transport Authority',          status: 'active',           issueDate: daysAgo(365*2),   expiryDate: daysFromNow(365*8),verified: true,  documentNumber: 'RJ-14 20220098765' },
      { id: 'fdoc-018', ownerId: 'fam-003', type: 'passport',          title: 'Passport',            issuer: 'Ministry of External Affairs', status: 'active',           issueDate: daysAgo(365*3),   expiryDate: daysFromNow(365*7),verified: true,  documentNumber: 'A9876543' },
      { id: 'fdoc-019', ownerId: 'fam-003', type: 'voter_id',          title: 'Voter ID',            issuer: 'Election Commission',          status: 'active',           issueDate: daysAgo(365*8),   expiryDate: null,              verified: true,  documentNumber: 'RJF9876543' },
    ],
  },
  {
    id: 'fam-004',
    name: 'Rohan Sharma',
    relationship: 'child',
    documents: [
      { id: 'fdoc-020', ownerId: 'fam-004', type: 'birth_certificate', title: 'Birth Certificate',   issuer: 'Municipal Corporation, Jaipur',status: 'active',           issueDate: '2015-08-10',     expiryDate: null,              verified: true,  documentNumber: 'BC-JR-2015-5566' },
      { id: 'fdoc-021', ownerId: 'fam-004', type: 'aadhaar',           title: 'Aadhaar Card',        issuer: 'UIDAI',                       status: 'active',           issueDate: daysAgo(365*6),   expiryDate: null,              verified: true,  documentNumber: 'XXXX XXXX 9900' },
      { id: 'fdoc-022', ownerId: 'fam-004', type: 'school_id',         title: 'School ID',           issuer: 'Delhi Public School, Jaipur',  status: 'expiring',         issueDate: daysAgo(340),     expiryDate: daysFromNow(25),   verified: true,  documentNumber: 'DPS-JR-2025-1234' },
      { id: 'fdoc-023', ownerId: 'fam-004', type: 'vaccination',       title: 'Vaccination Certificate',issuer:'Ministry of Health',          status: 'active',           issueDate: daysAgo(365*3),   expiryDate: null,              verified: true,  documentNumber: 'VAC-2021-ABCDEF' },
    ],
  },
];

// ─── Services ─────────────────────────────────────────────────────────────────

export const mockServices: Service[] = [
  {
    id: 'svc-001',
    title: 'Driving Licence Renewal',
    description: 'Renew your driving licence before it expires to avoid penalties and legal issues while driving.',
    category: 'Transport',
    processingDays: '3–5 business days',
    fees: '₹200 – ₹500 (varies by state)',
    gracePeriodNote: 'You can renew up to 30 days before or after expiry without penalty. After 30 days, a ₹1,000/year late fee applies.',
    requirements: [
      { id: 'req-001', label: 'Identity proof (Aadhaar / Voter ID)', available: true,  documentId: 'doc-002' },
      { id: 'req-002', label: 'Existing driving licence',            available: true,  documentId: 'doc-001' },
      { id: 'req-003', label: 'Address proof',                       available: true,  documentId: 'doc-006' },
      { id: 'req-004', label: 'Medical certificate (Form 1A)',        available: false },
    ],
    steps: ['Prepare documents', 'Submit application online', 'Aadhaar e-verification', 'Licence dispatched to address'],
    requiresPhysicalVisit: false,
  },
  {
    id: 'svc-002',
    title: 'Income Certificate',
    description: 'Official certificate of annual household income issued by the Revenue Department. Required for scholarships, subsidies and government schemes.',
    category: 'Revenue',
    processingDays: '7–10 business days',
    fees: '₹20 – ₹50 (nominal stamp duty)',
    gracePeriodNote: 'Income certificates are valid for 1 year. Apply for renewal before expiry to avoid disruption to ongoing schemes.',
    requirements: [
      { id: 'req-005', label: 'Identity proof (Aadhaar)', available: true,  documentId: 'doc-002' },
      { id: 'req-006', label: 'Address proof',            available: true,  documentId: 'doc-006' },
      { id: 'req-007', label: 'Income proof / ITR / Salary slip', available: false },
    ],
    steps: ['Prepare documents', 'Submit on e-District portal', 'Tehsildar review', 'Certificate issued & available in DigiLocker'],
    requiresPhysicalVisit: false,
  },
  {
    id: 'svc-003',
    title: 'Residence Certificate',
    description: 'Official certificate confirming your residential address, issued by the local authority.',
    category: 'Municipal',
    processingDays: '5–7 business days',
    fees: '₹10 – ₹30',
    gracePeriodNote: 'Valid for 1 year from issue date. Required as address proof for many central government services.',
    requirements: [
      { id: 'req-008', label: 'Identity proof (Aadhaar)',                    available: true,  documentId: 'doc-002' },
      { id: 'req-009', label: 'Address proof',                               available: true,  documentId: 'doc-006' },
      { id: 'req-010', label: 'Proof of residence (utility bill / rent agreement)', available: false },
    ],
    steps: ['Prepare documents', 'Submit application', 'Field verification (may be required)', 'Certificate issued'],
    requiresPhysicalVisit: true,
    visitReason: 'A field officer may visit your address for physical verification before the certificate is issued.',
  },
  {
    id: 'svc-004',
    title: 'Passport Application',
    description: 'Apply for a new Indian passport — required for international travel and valid as proof of citizenship.',
    category: 'Central',
    processingDays: '15–30 business days (Tatkaal: 3–5)',
    fees: '₹1,500 (Normal) · ₹3,500 (Tatkaal)',
    gracePeriodNote: 'Renew your passport at least 6 months before expiry when travelling internationally.',
    requirements: [
      { id: 'req-011', label: 'Identity proof (Aadhaar)',  available: true,  documentId: 'doc-002' },
      { id: 'req-012', label: 'Address proof',             available: true,  documentId: 'doc-006' },
      { id: 'req-013', label: 'Birth certificate',         available: true,  documentId: 'doc-007' },
    ],
    steps: ['Fill online form at Passport Seva', 'Pay fee online', 'Visit Passport Seva Kendra (biometrics)', 'Police verification', 'Passport dispatched'],
    requiresPhysicalVisit: true,
    visitReason: 'A visit to your nearest Passport Seva Kendra is mandatory for biometric capture and document verification.',
  },
  {
    id: 'svc-005',
    title: 'Scholarship Application',
    description: 'Apply for the state scholarship for higher education. The income certificate is a mandatory prerequisite.',
    category: 'Education',
    processingDays: '14–21 business days',
    fees: 'Free',
    gracePeriodNote: 'Applications open annually — check the state portal for current deadlines.',
    requirements: [
      { id: 'req-014', label: 'Identity proof (Aadhaar)', available: true,  documentId: 'doc-002' },
      { id: 'req-015', label: 'Address proof',            available: true,  documentId: 'doc-006' },
      { id: 'req-016', label: 'Income certificate',       available: false },
    ],
    steps: ['Prepare documents', 'Submit application online', 'Income verification', 'Institution confirmation', 'Scholarship awarded'],
    requiresPhysicalVisit: false,
  },
  {
    id: 'svc-006',
    title: 'Aadhaar Address Update',
    description: 'Update your residential address on Aadhaar with a new address proof document.',
    category: 'Central',
    processingDays: '5–10 business days',
    fees: '₹50',
    gracePeriodNote: 'You can update your Aadhaar address online via UIDAI portal or visit an Aadhaar Seva Kendra.',
    requirements: [
      { id: 'req-017', label: 'Existing Aadhaar card',   available: true,  documentId: 'doc-002' },
      { id: 'req-018', label: 'New address proof',       available: true,  documentId: 'doc-006' },
    ],
    steps: ['Login to UIDAI portal', 'Submit address update request', 'OTP verification', 'Aadhaar updated'],
    requiresPhysicalVisit: false,
  },
  {
    id: 'svc-007',
    title: 'PAN Card Application',
    description: 'Apply for a new PAN card — required for all financial and tax-related activities in India.',
    category: 'Revenue',
    processingDays: '7–15 business days',
    fees: '₹107 (physical) · ₹72 (digital)',
    gracePeriodNote: 'PAN cards do not expire. Apply once and the card is valid for life.',
    requirements: [
      { id: 'req-019', label: 'Identity proof (Aadhaar)', available: true,  documentId: 'doc-002' },
      { id: 'req-020', label: 'Address proof',            available: true,  documentId: 'doc-006' },
      { id: 'req-021', label: 'Date of birth proof',      available: true,  documentId: 'doc-007' },
    ],
    steps: ['Fill Form 49A online', 'Upload documents', 'Pay fee', 'Aadhaar e-sign', 'PAN dispatched'],
    requiresPhysicalVisit: false,
  },
  {
    id: 'svc-008',
    title: 'Voter ID Correction',
    description: 'Correct errors in your Voter ID card — name, photo, date of birth, or address.',
    category: 'Central',
    processingDays: '10–30 business days',
    fees: 'Free',
    gracePeriodNote: 'Corrections must be submitted at least 30 days before any election in your constituency.',
    requirements: [
      { id: 'req-022', label: 'Existing Voter ID',        available: true,  documentId: 'doc-004' },
      { id: 'req-023', label: 'Supporting document for correction', available: false },
    ],
    steps: ['Submit Form 8 online', 'Upload supporting documents', 'ERO review', 'Corrected card dispatched'],
    requiresPhysicalVisit: false,
  },
  {
    id: 'svc-009',
    title: 'Birth Certificate (Duplicate)',
    description: 'Apply for a duplicate birth certificate from the Municipal Corporation if the original is lost or damaged.',
    category: 'Municipal',
    processingDays: '7–14 business days',
    fees: '₹50 – ₹200',
    gracePeriodNote: 'Original birth certificate is a lifetime document. Keep a certified copy in DigiLocker.',
    requirements: [
      { id: 'req-024', label: 'Identity proof (Aadhaar)', available: true,  documentId: 'doc-002' },
      { id: 'req-025', label: 'Affidavit for loss (if lost)', available: false },
    ],
    steps: ['Apply at Municipal Corporation', 'Submit affidavit', 'Verification', 'Duplicate certificate issued'],
    requiresPhysicalVisit: true,
    visitReason: 'Visit the Municipal Corporation office to submit the application in person.',
  },
  {
    id: 'svc-010',
    title: 'Caste Certificate',
    description: 'Official caste/community certificate issued by the Revenue Department for SC/ST/OBC reservations and schemes.',
    category: 'Revenue',
    processingDays: '10–15 business days',
    fees: '₹10 – ₹20',
    gracePeriodNote: 'Valid for 3 years for most government schemes. Renew before applying to schemes that require a recent certificate.',
    requirements: [
      { id: 'req-026', label: 'Identity proof (Aadhaar)',  available: true,  documentId: 'doc-002' },
      { id: 'req-027', label: 'Address proof',             available: true,  documentId: 'doc-006' },
      { id: 'req-028', label: 'Self-declaration affidavit',available: false },
    ],
    steps: ['Apply on e-District portal', 'Upload documents', 'Tehsildar verification', 'Certificate issued'],
    requiresPhysicalVisit: false,
  },
];

// ─── Notifications (new) ──────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: 'expiry' | 'status' | 'action' | 'info';
  title: string;
  body: string;
  date: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
  actionParams?: Record<string, string>;
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    type: 'expiry',
    title: 'Driving Licence expiring soon',
    body: 'Your driving licence expires in 22 days. Renew now to avoid a ₹1,000/year penalty.',
    date: daysAgo(1),
    read: false,
    actionLabel: 'Renew now',
    actionRoute: 'RenewalFlow',
    actionParams: { documentId: 'doc-001' },
  },
  {
    id: 'notif-002',
    type: 'status',
    title: 'Application update',
    body: 'Your Income Certificate application moved to officer review. Expected: 3–5 more days.',
    date: daysAgo(2),
    read: false,
    actionLabel: 'Track',
    actionRoute: 'ApplicationStatus',
    actionParams: { applicationId: 'app-002' },
  },
  {
    id: 'notif-003',
    type: 'expiry',
    title: 'Income Certificate expiring',
    body: 'Your Income Certificate expires in 35 days. Renew to keep access to schemes and subsidies.',
    date: daysAgo(3),
    read: true,
    actionLabel: 'Renew',
    actionRoute: 'RenewalFlow',
    actionParams: { documentId: 'doc-005' },
  },
  {
    id: 'notif-004',
    type: 'action',
    title: 'Complete your Residence Certificate application',
    body: 'You saved a draft 1 day ago. You need 1 more document to submit.',
    date: daysAgo(1),
    read: true,
    actionLabel: 'Continue',
    actionRoute: 'ApplicationFlow',
    actionParams: { serviceId: 'svc-003', applicationId: 'app-003' },
  },
  {
    id: 'notif-005',
    type: 'info',
    title: 'Passport needs correction',
    body: "Your passport details don't match your Aadhaar. Start a correction to avoid issues while travelling.",
    date: daysAgo(5),
    read: true,
    actionLabel: 'Correct',
    actionRoute: 'CorrectionFlow',
    actionParams: { documentId: 'doc-008' },
  },
];

// ─── Intent matching ──────────────────────────────────────────────────────────

const intentKeywords: Record<string, string> = {
  'driving licence': 'svc-001',
  'driving license': 'svc-001',
  'licence renew':   'svc-001',
  'license renew':   'svc-001',
  'renew driving':   'svc-001',
  'driving expir':   'svc-001',
  'dl renew':        'svc-001',
  'dl expir':        'svc-001',

  'income certificate': 'svc-002',
  'income cert':        'svc-002',
  'proof of income':    'svc-002',
  'income proof':       'svc-002',
  'aay praman':         'svc-002',
  'aay pramaan':        'svc-002',

  'residence certificate': 'svc-003',
  'address certificate':   'svc-003',
  'niwas praman':          'svc-003',
  'domicile':              'svc-003',
  'residence cert':        'svc-003',

  'passport':   'svc-004',
  'travel doc': 'svc-004',

  'scholarship': 'svc-005',
  'scholarship application': 'svc-005',
  'education scholarship':   'svc-005',
};

export function matchServiceFromQuery(query: string): Service | null {
  const lower = query.toLowerCase();
  for (const [keyword, serviceId] of Object.entries(intentKeywords)) {
    if (lower.includes(keyword)) {
      return mockServices.find((s) => s.id === serviceId) ?? null;
    }
  }
  return null;
}

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getDocumentById(id: string): UserDocument | undefined {
  const all = [
    ...mockDocuments,
    ...mockFamily.flatMap((f) => f.documents),
  ];
  return all.find((d) => d.id === id);
}

export function getServiceById(id: string): Service | undefined {
  return mockServices.find((s) => s.id === id);
}

export function getApplicationById(id: string): Application | undefined {
  return mockApplications.find((a) => a.id === id);
}

export function getFamilyMemberById(id: string): FamilyMember | undefined {
  return mockFamily.find((f) => f.id === id);
}

export function getExpiringDocuments(): UserDocument[] {
  return mockDocuments.filter(
    (d) => d.status === 'expiring' || d.status === 'expired',
  );
}

export function getActiveApplications(): Application[] {
  return mockApplications.filter((a) => a.status === 'in_progress');
}

export function getDraftApplications(): Application[] {
  return mockApplications.filter((a) => a.status === 'draft');
}

export function getCompletedApplications(): Application[] {
  return mockApplications.filter((a) => a.status === 'completed');
}

export function getUnreadNotificationCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}
