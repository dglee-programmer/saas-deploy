'use server'

import { createClient } from '@/infrastructure/config/supabase/server';
import { SupabaseTagRepository } from '@/infrastructure/repositories/SupabaseTagRepository';
import { SupabaseNoteRepository } from '@/infrastructure/repositories/SupabaseNoteRepository';
import { CreateTagUseCase } from '@/core/application/use-cases/tag/CreateTagUseCase';
import { GetTagsUseCase } from '@/core/application/use-cases/tag/GetTagsUseCase';
import { UpdateTagUseCase } from '@/core/application/use-cases/tag/UpdateTagUseCase';
import { DeleteTagUseCase } from '@/core/application/use-cases/tag/DeleteTagUseCase';
import { AttachTagToNoteUseCase } from '@/core/application/use-cases/tag/AttachTagToNoteUseCase';
import { DetachTagFromNoteUseCase } from '@/core/application/use-cases/tag/DetachTagFromNoteUseCase';
import { GetNotesByTagUseCase } from '@/core/application/use-cases/tag/GetNotesByTagUseCase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getTagUseCases() {
  const supabase = await createClient();
  const tagRepository = new SupabaseTagRepository(supabase);
  const noteRepository = new SupabaseNoteRepository(supabase);
  
  return {
    create: new CreateTagUseCase(tagRepository),
    getTags: new GetTagsUseCase(tagRepository),
    update: new UpdateTagUseCase(tagRepository),
    deleteTag: new DeleteTagUseCase(tagRepository),
    attach: new AttachTagToNoteUseCase(tagRepository),
    detach: new DetachTagFromNoteUseCase(tagRepository),
    getNotesByTag: new GetNotesByTagUseCase(tagRepository, noteRepository),
    supabase
  };
}

export async function createTagAction(name: string, color: string = 'default') {
  const { create, supabase } = await getTagUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const tag = await create.execute({ userId: user.id, name, color });
  revalidatePath('/', 'layout');
  return { id: tag.id, name: tag.name, color: tag.color };
}

export async function getTagsAction() {
  const { getTags, supabase } = await getTagUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const tags = await getTags.execute({ userId: user.id });
  return tags.map(t => ({ id: t.id, name: t.name, color: t.color }));
}

export async function attachTagToNoteAction(noteId: string, tagName: string) {
  const { create, attach, supabase } = await getTagUseCases();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. 태그가 없으면 생성하거나 있으면 가져옴
  const tag = await create.execute({ userId: user.id, name: tagName });
  
  // 2. 노트에 태그 부착
  await attach.execute({ noteId, tagId: tag.id, userId: user.id });
  
  revalidatePath('/', 'layout');
}

export async function detachTagFromNoteAction(noteId: string, tagName: string) {
  const { supabase } = await getTagUseCases();
  const tagRepository = new SupabaseTagRepository(supabase);
  const detach = new DetachTagFromNoteUseCase(tagRepository);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. 태그 찾기
  const tag = await tagRepository.findByName(user.id, tagName);
  if (!tag) return;

  // 2. 분리
  await detach.execute({ noteId, tagId: tag.id });
  
  revalidatePath('/', 'layout');
}

export async function deleteTagAction(id: string) {
  const { deleteTag } = await getTagUseCases();
  await deleteTag.execute({ id });
  revalidatePath('/', 'layout');
}

export async function updateTagAction(id: string, dto: { name?: string, color?: string }) {
  const { update } = await getTagUseCases();
  await update.execute({ id, ...dto });
  revalidatePath('/', 'layout');
}
