'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

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
      onClick={handleLikes}
      disabled={pending}
      className="flex items-center group"
    >
      {tweet.user_liked ? (
        <AiFillHeart className="text-red-600 group-hover:text-gray-500" />
      ) : (
        <AiOutlineHeart className="text-gray-500 group-hover:text-red-600" />
      )}
      <div
        className={`ml-2 text-sm ${
          tweet.user_liked
            ? 'text-red-600 group-hover:text-gray-500'
            : 'text-gray-500 group-hover:text-red-600'
        }`}
      >
        {tweet.likes}
      </div>
    </button>
  );
}
