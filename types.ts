export enum MaintenanceStatus {
  DaInviare = 'Da inviare',
  InDiscussione = 'In discussione',
  Programmata = 'Programmata',
  Risolta = 'Risolta',
  Superata = 'Superata',
  Rifiutata = 'Rifiutata',
}

export enum EquipmentStatus {
  Operativo = 'Operativo',
  InManutenzione = 'In Manutenzione',
  Guasto = 'Guasto',
  FuoriServizio = 'Fuori Servizio',
}

export enum PeriodicEquipmentStatus {
    NonEseguito = 'Non Eseguito',
    Scaduto = 'Scaduto',
    InScadenza = 'In Scadenza',
    Completo = 'Completo',
    NonApplicabile = 'Non Applicabile',
}

export enum PurchaseStatus {
    Aperta = 'Aperta',
    Approvata = 'Approvata',
    Ordinata = 'Ordinata',
    Ricevuta = 'Ricevuta',
    Completata = 'Completata',
}

export enum Role {
    Admin = 'Admin',
    MaintManagerPeriodic = 'Resp. Man. Periodica',
    MaintWorkerPeriodic = 'Op. Man. Periodica',
    MaintManagerExtra = 'Resp. Man. Straordinaria',
    MaintWorkerExtra = 'Op. Man. Straordinaria',
    WarehouseManager = 'Resp. Magazzino',
    PurchasingManager = 'Resp. Acquisti',
    Requester = 'Richiedente',
}

export enum MaintenanceType {
  Periodica = 'Periodica',
  Straordinaria = 'Straordinaria',
}

export type PeriodicityUnit = 'giorni' | 'mesi' | 'anni';

export interface Periodicity {
  value: number;
  unit: PeriodicityUnit;
}

export interface Site {
    id: number;
    name: string;
    company_id: number;
}

export interface Company {
    id: number;
    name: string;
}

export interface FloorPlan {
  id: number;
  name: string;
  site_id: number;
  svg_url: string;
}

export interface Equipment {
  id: string;
  name: string;
  location: string;
  site_id: number;
  category: string;
  status: EquipmentStatus;
  last_maintenance: string;
  floor_plan_id?: number;
  position?: { x: number; y: number };
}

export interface ExecutionRecord {
  completion_date: string;
  notes?: string;
  attachment?: string;
  // FIX: User ID from Supabase is a string (UUID).
  user_id: string;
}

export interface MaintenanceEquipmentLink {
    equipment_id: string;
    status: PeriodicEquipmentStatus;
    due_date?: string;
    execution_history: ExecutionRecord[];
    // For upcoming intervention
    notes?: string;
    attachment?: string;
    // For variable assignment
    // FIX: User ID from Supabase is a string (UUID).
    manager_id?: string;
    // FIX: User ID from Supabase is a string (UUID).
    assignee_id?: string;
}

export interface MaintenanceRequest {
  id: number;
  description: string; // This serves as the title
  details?: string; // New field for detailed description
  status: MaintenanceStatus;
  priority: 'Alta' | 'Media' | 'Bassa';
  type: MaintenanceType;
  creation_date: string;
  // FIX: User ID from Supabase is a string (UUID).
  requester_id: string;
  // FIX: User ID from Supabase is a string (UUID).
  assignee_id?: string; // The worker
  // FIX: User ID from Supabase is a string (UUID).
  manager_id?: string; // The responsible person
  
  // For extraordinary maintenance
  equipment_id?: string;
  scheduled_date?: string;

  // For periodic maintenance
  assignment_type?: 'Fissi' | 'Variabili';
  linked_categories?: string[];
  equipment_list?: MaintenanceEquipmentLink[];
  periodicity?: Periodicity;
  due_soon_days?: number;
  
  // General details, used for approval notes in extraordinary
  notes?: string;
  attachment?: string;
}

export interface SparePart {
  id: string;
  name: string;
  quantity: number;
  min_stock: number;
  location: string;
}

export interface PurchaseRequest {
  id: number;
  item: string;
  quantity: number;
  maintenance_id?: number;
  spare_part_id?: string;
  request_date: string;
  status: PurchaseStatus;
}

export interface User {
  // FIX: User ID from Supabase is a string (UUID), not a number.
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  roles: Role[];
}

export interface MaintenanceLog {
  id: number;
  maintenance_id: number;
  // FIX: User ID from Supabase is a string (UUID).
  user_id: string;
  timestamp: string;
  note: string;
  attachment?: string;
}