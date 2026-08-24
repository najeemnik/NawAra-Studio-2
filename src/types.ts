export type Language = 'fa' | 'en' | 'ps';

export type ProjectTypology = 
  | 'commercial' 
  | 'residential' 
  | 'civic_cultural' 
  | 'healthcare' 
  | 'educational' 
  | 'infrastructure' 
  | 'hospitality';

export type ProjectStatus = 
  | 'completed' 
  | 'under_construction' 
  | 'in_design' 
  | 'concept';

export interface ProjectDiagram {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  iconType: 'sun' | 'wind' | 'geometry' | 'community' | 'green';
}

export interface ProjectImage {
  id: string;
  url: string;
  caption: Record<Language, string>;
  resolution: '8K UHD' | '4K UHD' | '2K HD';
  isHero?: boolean;
}

export interface Model3DConfig {
  type: 'tower' | 'parametric_villa' | 'cultural_pavilion' | 'modular_complex' | 'stadium_shell';
  floors: number;
  heightMeters: number;
  colorTheme: string;
  wireframeColor: string;
  rotationSpeed?: number;
  hasRoofGarden?: boolean;
  hasCurvedFacade?: boolean;
}

export interface ArchitecturalProject {
  id: string;
  slug: string;
  title: Record<Language, string>;
  tagline: Record<Language, string>;
  location: Record<Language, string>;
  city: string;
  country: string;
  year: string;
  areaSqm: string;
  typology: ProjectTypology;
  status: ProjectStatus;
  progressPercent: number;
  clientName: Record<Language, string>;
  collaborators: Record<Language, string>;
  structuralEngineer: Record<Language, string>;
  sustainabilityRating: string;
  estimatedBudgetUsd?: string;
  story: Record<Language, string>;
  conceptDescription: Record<Language, string>;
  features: Record<Language, string[]>;
  heroImage: string;
  gallery: ProjectImage[];
  diagrams: ProjectDiagram[];
  model3d: Model3DConfig;
  cpmProjectId?: string; // Linked to CPM
  featured?: boolean;
}

// CPM Roles and Types
export type UserRole = 
  | 'super_admin'
  | 'project_manager'
  | 'site_engineer'
  | 'finance_officer'
  | 'client'
  | 'contractor';

export interface Permission {
  id: string;
  code: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
}

export interface CPMUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  companyOrClientName?: string;
  assignedProjectIds: string[];
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
}

export type ConstructionPhaseStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface ConstructionPhase {
  id: string;
  name: Record<Language, string>;
  order: number;
  progressPercent: number;
  status: ConstructionPhaseStatus;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  notes?: string;
  supervisorName: string;
}

export interface DailySiteReport {
  id: string;
  projectId: string;
  date: string;
  authorName: string;
  authorRole: string;
  weather: string;
  temperatureC: number;
  activeWorkersCount: number;
  tasksCompleted: string[];
  tasksPlannedForTomorrow: string[];
  materialArrivals: string[];
  safetyIncidents: string;
  photoUrls: string[];
  isClientVisible: boolean;
}

export interface CPMProject {
  id: string;
  code: string;
  name: Record<Language, string>;
  location: string;
  clientId: string;
  clientName: string;
  managerId: string;
  managerName: string;
  totalBudgetUsd: number;
  paidAmountUsd: number;
  startDate: string;
  estimatedHandoverDate: string;
  overallProgressPercent: number;
  status: 'active' | 'on_hold' | 'completed' | 'procurement';
  currentPhaseName: Record<Language, string>;
  phases: ConstructionPhase[];
  galleryUrls: string[];
  lastUpdateDate: string;
}

export interface FinancialTransaction {
  id: string;
  projectId: string;
  projectName: string;
  type: 'income_client_payment' | 'expense_materials' | 'expense_labor' | 'expense_equipment';
  title: string;
  amountUsd: number;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  invoiceNumber: string;
  payerOrPayee: string;
}

export interface MaterialItem {
  id: string;
  projectId: string;
  name: Record<Language, string>;
  category: 'cement_concrete' | 'rebar_steel' | 'glass_facade' | 'mep_electrical' | 'finishing';
  quantity: number;
  unit: string;
  minThreshold: number;
  supplier: string;
  status: 'sufficient' | 'low_stock' | 'reorder_placed';
}
