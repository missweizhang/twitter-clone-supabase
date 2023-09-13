import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthButton from './components/AuthButton';
import NewTweet from './components/NewTweet.tsx';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: tweets } = await supabase
    .from('tweets')
    .select('*, profiles(*)');

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto mt-5">
      <AuthButton session={session} />

      <NewTweet />

      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <p>
            {tweet?.profiles?.name} {tweet?.profiles?.username}
          </p>
          <p>
            {'>'} {tweet?.title}
          </p>
        </div>
      ))}
    </div>
  );
}
