import { cookies } from 'next/headers';
import { User, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function NewTweet({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    'use server';
    const supabase = createServerActionClient({ cookies });

    const title = String(formData.get('title'));
    await supabase.from('tweets').insert({ user_id: user.id, title });
    revalidatePath('/');
  };

  return (
    <form action={addTweet} className="border border-gray-800 border-t-0">
      <div className="flex py-8 px-4">
        <div>
          <Image
            src={user.user_metadata.avatar_url}
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          name="title"
          className="bg-inherit flex-1 ml-2 px-2 text-2xl leading-loose placeholder-gray-500"
          placeholder="What is happening?!"
        />
      </div>
    </form>
  );
}
