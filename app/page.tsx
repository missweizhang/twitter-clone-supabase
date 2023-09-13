import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthButton from './components/AuthButton';
import NewTweet from './components/NewTweet.tsx';
import Tweets from './components/Tweets.tsx';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data } = await supabase
    .from('tweets')
    .select('*, author: profiles(*), likes(user_id)');

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_liked: !!tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto mt-5">
      <AuthButton session={session} />

      <NewTweet />

      <Tweets tweets={tweets} />
    </div>
  );
}
