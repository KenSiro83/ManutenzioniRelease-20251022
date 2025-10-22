import {
  EquipmentStatus,
  MaintenanceStatus,
  MaintenanceType,
  PurchaseStatus,
  Role,
  PeriodicEquipmentStatus,
} from './types';

// Questi dati sono ora caricati dal server (Supabase), quindi gli array sono vuoti.
export const COMPANIES = [];
export const SITES = [];
export const FLOOR_PLANS = [];
export const USERS = [];
export const EQUIPMENT = [];
export const MAINTENANCE_REQUESTS = [];
export const SPARE_PARTS = [];
export const PURCHASE_REQUESTS = [];
export const MAINTENANCE_LOGS = [];


export const EQUIPMENT_CATEGORIES: string[] = [
  'Meccanica', 'Elettrica', 'Idraulica', 'Pneumatica', 'Strumentazione', 'Edificio'
];