'use client';

import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const AuthButton = ({ session }: { session: Session | null }) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: 'http://localhost:3000/auth/callback' },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <button
      onClick={handleSignOut}
      className="p-2 w-[80px] text-rose-500 border border-rose-500 hover:bg-rose-100 rounded-md cursor-pointer"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={handleSignIn}
      className="p-2 w-[80px] text-white bg-rose-500 hover:bg-rose-400 rounded-md cursor-pointer"
    >
      Login
    </button>
  );
};

export default AuthButton;
