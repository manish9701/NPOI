// ─── Core types for NPOI MVP v2 ──────────────────────────────────────────────

export type DocumentStatus = 'active' | 'expiring' | 'expired' | 'pending' | 'needs_correction';
export type ApplicationStatus = 'draft' | 'submitted' | 'in_progress' | 'completed' | 'rejected';
export type Relationship = 'self' | 'mother' | 'father' | 'spouse' | 'child';

export interface UserDocument {
  id: string;
  ownerId: string;
  type: string;
  title: string;
  issuer: string;
  status: DocumentStatus;
  issueDate: string;
  expiryDate: string | null;
  verified: boolean;
  documentNumber: string;
}

export interface ApplicationStep {
  id: number;
  label: string;
  completed: boolean;
  active: boolean;
}

export interface Application {
  id: string;
  ownerId: string;
  service: string;
  serviceId: string;
  status: ApplicationStatus;
  progress: number;
  totalSteps: number;
  nextAction: string;
  submittedDate: string | null;
  updatedDate: string;
  steps: ApplicationStep[];
  rejectionReason?: string;
  estimatedDays: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Relationship;
  documents: UserDocument[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  location: string;
  state: string;
}

export interface ServiceRequirement {
  id: string;
  label: string;
  available: boolean;
  documentId?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  processingDays: string;
  fees: string;
  gracePeriodNote: string;
  requirements: ServiceRequirement[];
  steps: string[];
  requiresPhysicalVisit: boolean;
  visitReason?: string;
}

export interface JourneyState {
  serviceId: string;
  missingDocumentIds: string[];
  resumeAfterDocumentId?: string;
}

// ─── Navigation param lists ───────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  AskScreen: undefined;
  GoalConfirmation: { query: string; serviceId: string };
  Requirements: { serviceId: string };
  MissingDocument: { documentType: string; returnServiceId: string };
  DocumentDetail: { documentId: string };
  ApplicationFlow: { serviceId: string; applicationId?: string };
  ApplicationStatus: { applicationId: string };
  ApplicationSuccess: { serviceId: string; applicationId: string };
  RenewalFlow: { documentId: string };
  CorrectionFlow: { documentId: string };
  ShareDocument: { documentId: string };
  FamilyMember: { memberId: string };
  FamilyScreen: undefined;
  SearchScreen: undefined;
  Notifications: undefined;
};

export type TabParamList = {
  Home: undefined;
  Documents: undefined;
  Applications: undefined;
  Profile: undefined;
};
