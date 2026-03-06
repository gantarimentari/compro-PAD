/**
 * Centralized services index.
 * Import from here instead of importing from individual service files.
 *
 * Usage:
 *   import { patientService, hewanService } from '@/lib/services';
 *   // OR
 *   import patientService from '@/lib/services/patientService';
 */

export { default as authService } from './authService';
export { default as patientService } from './patientService';
export { default as hewanService } from './hewanService';
export { default as jenisHewanService } from './jenisHewanService';
export { default as articleService } from './articleService';
export { default as mediaService } from './mediaService';
export { default as promoService } from './promoService';
export { default as reservasiService } from './reservasiService';
export { default as adminService } from './adminService';
export { default as systemInfoService } from './systemInfoService';
export { default as dashboardService } from './dashboardService';
export { default as profileService } from './profileService';
