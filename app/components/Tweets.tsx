'use client';

import { useEffect, experimental_useOptimistic as useOptimistic } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Likes from './Likes';
import Image from 'next/image.js';

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return optimisticTweets.map((tweet) => (
    <div
      key={tweet.id}
      className="border border-gray-800 border-t-0 px-4 py-8 flex"
    >
      <div>
        <Image
          src={tweet.author.avatar_url}
          alt="user avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="ml-4">
        <p>
          <span className="font-bold">{tweet.author.name}</span>{' '}
          <span className="text-sm ml-2 text-gray-400">
            {tweet.author.username}
          </span>
        </p>
        <p>
          {'>'} {tweet.title}
        </p>
        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      </div>
    </div>
  ));
}
