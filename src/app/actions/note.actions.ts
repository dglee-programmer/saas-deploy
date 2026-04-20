'use server'

import { createClient } from '@/infrastructure/config/supabase/server';
import { SupabaseNoteRepository } from '@/infrastructure/repositories/SupabaseNoteRepository';
import { GetRecentNotesUseCase } from '@/core/application/use-cases/note/GetRecentNotesUseCase';
import { CreateNoteUseCase } from '@/core/application/use-cases/note/CreateNoteUseCase';
import { GetNoteUseCase } from '@/core/application/use-cases/note/GetNoteUseCase';
import { UpdateNoteUseCase } from '@/core/application/use-cases/note/UpdateNoteUseCase';
import { redirect } from 'next/navigation';
import { ensureUserProfile, getUserProfile } from '@/app/actions/auth.actions';

async function ensurePremium() {
  const profile = await getUserProfile();
  if (!profile || profile.subscription_tier !== 'premium') {
    redirect('/dashboard/billing');
  }
  return profile;
}

async function getNoteUseCases() {
  const supabase = await createClient();
  const noteRepository = new SupabaseNoteRepository(supabase);
  
  return {
    getRecent: new GetRecentNotesUseCase(noteRepository),
    create: new CreateNoteUseCase(noteRepository),
    getById: new GetNoteUseCase(noteRepository),
    update: new UpdateNoteUseCase(noteRepository),
    supabase
  };
}

export async function getDashboardData(query: string = '') {
  const { getRecent, supabase } = await getNoteUseCases();
  const noteRepository = new SupabaseNoteRepository(supabase);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { notes: [], user: null };
  }

  // Get User Profile (Includes subscription tier)
  const profile = await getUserProfile();
  if (!profile) {
    return { notes: [], profile: null, isPremium: false };
  }

  let notes = [];
  const isPremium = profile.subscription_tier === 'premium';
  
  if (isPremium) {
    if (query) {
      notes = await noteRepository.searchByUserId(profile.id, query);
    } else {
      notes = await getRecent.execute({ userId: profile.id, limit: 12 });
    }
  }
  
  // Convert Class instances to Plain Objects for Client Components
  return { 
    notes: notes.map(n => ({
      id: n.id,
      userId: n.userId,
      folderId: n.folderId,
      title: n.title,
      content: n.content,
      wordCount: n.wordCount,
      tags: n.tags,
      isShared: n.isShared,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString()
    })), 
    profile,
    isPremium
  };
}

export async function createNewNoteAction() {
  const { create, supabase } = await getNoteUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth');
  }

  // Ensure user is premium
  const profile = await ensurePremium();

  const note = await create.execute({
    userId: profile.id,
    title: '제목 없는 메모',
    content: ''
  });

  redirect(`/notes/${note.id}`);
}

export async function deleteNoteAction(id: string) {
  await ensurePremium();
  const { supabase } = await getNoteUseCases();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
  redirect('/dashboard');
}

export async function updateNoteAction(dto: { id: string; title?: string; content?: string }) {
  await ensurePremium();
  const { update } = await getNoteUseCases();
  await update.execute(dto);
}

export async function getNoteAction(id: string) {
  await ensurePremium();
  const { getById } = await getNoteUseCases();
  return await getById.execute({ id });
}
