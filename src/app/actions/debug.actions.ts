'use server'

import { createClient } from '@/infrastructure/config/supabase/server';

export async function probeDbAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { message: 'No auth user' };

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: folders, error: foldersError } = await supabase
    .from('folders')
    .select('*')
    .limit(1);

  return {
    userId: user.id,
    profile,
    profileError,
    foldersError
  };
}

