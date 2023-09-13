import { Database as DB } from '@/lib/database.types.ts';

type Tweet = DB['public']['Tables']['tweets']['Row'];
type Profile = DB['public']['Tables']['profiles']['Row'];

declare global {
  type Database = DB;

  type TweetWithAuthor = Tweet & {
    author: Profile;
    likes: number;
    user_liked: boolean;
  };
}
