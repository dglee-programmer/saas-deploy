'use server'

import { createClient } from '@/infrastructure/config/supabase/server';
import { SupabaseNoteRepository } from '@/infrastructure/repositories/SupabaseNoteRepository';
import { SupabaseTagRepository } from '@/infrastructure/repositories/SupabaseTagRepository';
import { GetRecentNotesUseCase } from '@/core/application/use-cases/note/GetRecentNotesUseCase';
import { CreateNoteUseCase } from '@/core/application/use-cases/note/CreateNoteUseCase';
import { GetNoteUseCase } from '@/core/application/use-cases/note/GetNoteUseCase';
import { UpdateNoteUseCase } from '@/core/application/use-cases/note/UpdateNoteUseCase';
import { redirect } from 'next/navigation';
import { ensureUserProfile, getUserProfile } from '@/app/actions/auth.actions';

import { Note } from '@/core/domain/entities/Note';

async function ensureOwnership(noteId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');
  
  const { data: note } = await supabase
    .from('notes')
    .select('user_id')
    .eq('id', noteId)
    .maybeSingle();
    
  if (!note) return; // 메모가 이미 삭제되었거나 없는 경우 권한 에러를 내지 않음

  if (note.user_id !== user.id) {
    throw new Error('Unauthorized');
  }
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

export async function getDashboardData(query: string = '', tagId?: string): Promise<{ notes: any[], user?: any, profile?: any, isPremium?: boolean, tags: any[] }> {
  const { getRecent, supabase } = await getNoteUseCases();
  const noteRepository = new SupabaseNoteRepository(supabase);
  const tagRepository = new SupabaseTagRepository(supabase);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { notes: [] as any[], user: null, tags: [] };
  }

  // Get User Profile (Includes subscription tier)
  const profile = await getUserProfile();
  if (!profile) {
    return { notes: [] as any[], profile: null, isPremium: false, tags: [] };
  }

  // Get User Tags
  const tags = await tagRepository.findByUserId(profile.id);

  let notes: Note[] = [];
  const isPremium = profile.subscription_tier === 'premium';
  
  if (tagId) {
    const { getNotesByTag } = await import('@/core/application/use-cases/tag/GetNotesByTagUseCase');
    const getNotesByTagUseCase = new getNotesByTag(tagRepository, noteRepository);
    notes = await getNotesByTagUseCase.execute({ tagId });
  } else if (query) {
    notes = await noteRepository.searchByUserId(profile.id, query);
  } else {
    notes = await getRecent.execute({ userId: profile.id, limit: 12 });
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
      isPinned: n.isPinned,
      isShared: n.isShared,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString()
    })), 
    profile,
    isPremium,
    tags: tags.map(t => ({ id: t.id, name: t.name, color: t.color }))
  };
}

import { generateNoteUrl } from '@/lib/utils';

export async function createNewNoteAction() {
  const { create, supabase } = await getNoteUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth');
  }

  const profile = await getUserProfile();
  if (!profile) redirect('/auth');

  // Check limits for standard users
  if (profile.subscription_tier !== 'premium') {
    const { getRecent, supabase: noteSupabase } = await getNoteUseCases();
    const noteRepository = new SupabaseNoteRepository(noteSupabase);
    const count = await noteRepository.countByUserId(profile.id);
    
    if (count >= 30) {
      redirect('/dashboard/billing'); // Limit reached
    }
  }

  const note = await create.execute({
    userId: profile.id,
    title: '제목 없는 메모',
    content: ''
  });

  redirect(generateNoteUrl(note.id, note.title));
}

import { revalidatePath } from 'next/cache';

export async function deleteNoteAction(id: string) {
  try {
    await ensureOwnership(id);
    const { supabase } = await getNoteUseCases();
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateNoteAction(dto: { id: string; title?: string; content?: string }) {
  await ensureOwnership(dto.id);
  const { update } = await getNoteUseCases();
  await update.execute(dto);
  revalidatePath('/', 'layout');
}

export async function getNoteAction(id: string) {
  await ensureOwnership(id);
  const { getById } = await getNoteUseCases();
  return await getById.execute({ id });
}

export async function togglePinNoteAction(id: string) {
  try {
    await ensureOwnership(id);
    const { getById, supabase } = await getNoteUseCases();
    const noteRepository = new SupabaseNoteRepository(supabase);
    const note = await getById.execute({ id });
    if (!note) throw new Error('Note not found');

    note.togglePin();
    await noteRepository.update(note);

    revalidatePath('/', 'layout');
    return { success: true, isPinned: note.isPinned };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
