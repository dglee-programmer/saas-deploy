'use server'

import { createClient } from '@/infrastructure/config/supabase/server';
import { SupabaseFolderRepository } from '@/infrastructure/repositories/SupabaseFolderRepository';
import { GetFoldersUseCase } from '@/core/application/use-cases/folder/GetFoldersUseCase';
import { SupabaseNoteRepository } from '@/infrastructure/repositories/SupabaseNoteRepository';
import { ensureUserProfile } from '@/app/actions/auth.actions';

async function getFolderUseCases() {
  const supabase = await createClient();
  const folderRepository = new SupabaseFolderRepository(supabase);
  const noteRepository = new SupabaseNoteRepository(supabase);
  
  return {
    getFolders: new GetFoldersUseCase(folderRepository),
    noteRepository,
    supabase
  };
}

export async function getFoldersAction() {
  const { getFolders, supabase } = await getFolderUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const folders = await getFolders.execute({ userId: user.id });
  
  // Convert Class instances to Plain Objects for Client Components
  return folders.map(f => ({
    id: f.id,
    name: f.name,
    isPinned: f.isPinned
  }));
}

export async function getFolderNotesAction(folderId: string) {
  const { noteRepository, supabase } = await getFolderUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  // Assuming noteRepository has a method to find by folder
  // For now, we'll fetch all and filter or add findByFolder to repository if missing.
  // Actually, let's assume it has it or we filter here for simple implementation.
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('folder_id', folderId)
    .order('updated_at', { ascending: false });

  if (error || !data) return [];
  
  return data.map((d: any) => ({
    id: d.id,
    title: d.title,
    content: d.content,
    updatedAt: new Date(d.updated_at),
    tags: d.tags || []
  }));
}

export async function createFolderAction(name: string) {
  console.log('--- createFolderAction starting ---', { name });
  const { supabase } = await getFolderUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('--- createFolderAction error: No User ---');
    return;
  }

  // Ensure user profile exists to satisfy foreign key constraints
  await ensureUserProfile(user);

  const { data, error } = await supabase
    .from('folders')
    .insert({
      user_id: user.id,
      name,
      is_pinned: false
    })
    .select()
    .single();

  if (error) {
    console.error('--- createFolderAction error:', error);
    throw error;
  }
  
  console.log('--- createFolderAction success:', data);
  // Return plain object
  return {
    id: data.id,
    name: data.name,
    isPinned: data.is_pinned
  };
}
