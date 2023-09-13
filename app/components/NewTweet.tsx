import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default function NewTweet() {
  const addTweet = async (formData: FormData) => {
    'use server';
    const supabase = createServerActionClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const title = String(formData.get('title'));
      await supabase.from('tweets').insert({ user_id: user.id, title });
      revalidatePath('/');
    }
  };

  return (
    <form action={addTweet}>
      <input name="title" className="outline" />
    </form>
  );
}
