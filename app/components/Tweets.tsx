'use client';

import { experimental_useOptimistic as useOptimistic } from 'react';
import Likes from './Likes.tsx';

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (state, newTweet) =>
    state.map((tweet) => (tweet.id === newTweet.id ? newTweet : tweet))
  );

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
