import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const user = await requireAuth();
  
  if (!user) {
    redirect('/login');
  }

  return <ProfileClient user={user} />;
}


