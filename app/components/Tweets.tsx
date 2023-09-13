'use client';

import { useEffect, experimental_useOptimistic as useOptimistic } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Likes from './Likes.tsx';

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (state, newTweet) =>
    state.map((tweet) => (tweet.id === newTweet.id ? newTweet : tweet))
  );

  const router = useRouter();

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const channel = supabase
      .channel('realtime tweets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tweets',
        },
        (payload) => router.refresh()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase, router]);

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>
        {tweet.author.name} {tweet.author.username}
      </p>
      <p>
        {'>'} {tweet.title}
      </p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
