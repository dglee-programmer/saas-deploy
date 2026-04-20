'use server'

import { createClient } from '@/infrastructure/config/supabase/server';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function getUserSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }
  });

  if (error) {
    return { error: error.message };
  }

  // If Supabase is configured to auto-confirm or if a session is returned immediately
  if (data.session) {
    redirect('/dashboard');
  }

  // If email confirmation is required
  return { success: true };
}

export async function ensureUserProfile(user: any) {
  const supabase = await createClient();
  
  const { data: profile, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    // Upsert the profile to ensure it exists (Foreign Key preservation)
    await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      updated_at: new Date().toISOString()
    });
  }
}

export async function updateProfileAction(formData: FormData) {
  const fullName = formData.get('full_name') as string;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. Update public profile
  const { error: profileError } = await supabase
    .from('users')
    .update({ 
      full_name: fullName,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (profileError) throw profileError;

  // 2. Update Auth metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (authError) throw authError;

  return { success: true };
}
