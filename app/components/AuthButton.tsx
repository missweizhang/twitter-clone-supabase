'use client';

import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import GitHubButton from './GitHubButton';

const AuthButton = ({ session }: { session: Session | null }) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <button onClick={handleSignOut} className="text-xs text-gray-400">
      Logout
    </button>
  ) : (
    <GitHubButton />
  );
};

export default AuthButton;
