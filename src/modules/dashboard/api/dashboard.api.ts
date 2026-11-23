import { apiRequest } from '@/lib/api/client/api-client';
import type { DashboardStats } from '@/modules/dashboard/types/dashboard.types';

export function getAdminDashboardStats() {
  return apiRequest<DashboardStats>('/api/admin/dashboard');
}
