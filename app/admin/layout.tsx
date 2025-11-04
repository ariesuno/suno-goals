import { redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth/utils';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const admin = await isAdmin();

  if (!user) {
    redirect('/login');
  }

  if (!admin) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}

