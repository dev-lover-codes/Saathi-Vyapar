'use client';

import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await supabaseClient.auth.signOut();
    } catch {
      // Ignore signout error
    }
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg border border-rose-800 transition-colors cursor-pointer"
    >
      लॉगआउट / Logout
    </button>
  );
}
