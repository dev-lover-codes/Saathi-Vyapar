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
      className="px-4 py-2 bg-[#F0EFEB] hover:bg-[#FFDAD6] text-[#93000A] text-xs font-semibold rounded-full border border-[#E5E2E1] transition-all cursor-pointer"
    >
      लॉगआउट / Logout
    </button>
  );
}
