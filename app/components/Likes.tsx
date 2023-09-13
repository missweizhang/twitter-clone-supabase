'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}) {
  const router = useRouter();
  const { pending } = useFormStatus();

  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (tweet.user_liked) {
        // dislike
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_liked: !tweet.user_liked,
        });

        await supabase
          .from('likes')
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
        router.refresh();
      } else {
        // like
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_liked: !tweet.user_liked,
        });

        await supabase
          .from('likes')
          .insert({ user_id: user.id, tweet_id: tweet.id });
        router.refresh();
      }
    }
  };

  return (
    <button
      className="px-2 text-rose-500 border border-rose-500 hover:bg-rose-100 rounded-md cursor-pointer"
      onClick={handleLikes}
      disabled={pending}
    >
      {tweet.likes} Likes
    </button>
  );
}
