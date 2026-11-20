import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/auth/require-admin';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  return <AdminShell>{children}</AdminShell>;
}
