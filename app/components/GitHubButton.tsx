'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function GitHubButton() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: 'http://localhost:3000/auth/callback' },
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className=" hover:bg-gray-800 p-8 rounded-xl"
    >
      <Image
        src="/github-mark-white.png"
        alt="github"
        width={100}
        height={100}
      />
    </button>
  );
}
