import { Tag } from '@/core/domain/entities/Tag';
import { TagRepository } from '@/core/application/interfaces/TagRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseTagRepository implements TagRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<Tag | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByUserId(userId: string): Promise<Tag[]> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error || !data) return [];
    return data.map(this.mapToEntity);
  }

  async findByNoteId(noteId: string): Promise<Tag[]> {
    // 1. note_tags에서 tag_id 목록 가져오기
    const { data: noteTags, error: ntError } = await this.supabase
      .from('note_tags')
      .select('tag_id')
      .eq('note_id', noteId);

    if (ntError || !noteTags || noteTags.length === 0) return [];

    // 2. tag_id들로 tags 조회
    const tagIds = noteTags.map(nt => nt.tag_id);
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .in('id', tagIds);

    if (error || !data) return [];
    return data.map(item => this.mapToEntity(item));
  }

  async findByName(userId: string, name: string): Promise<Tag | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .eq('name', name)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async create(tag: Tag): Promise<void> {
    const { error } = await this.supabase
      .from('tags')
      .insert({
        id: tag.id,
        user_id: tag.userId,
        name: tag.name,
        color: tag.color,
        created_at: tag.createdAt.toISOString(),
        updated_at: tag.updatedAt.toISOString(),
      });

    if (error) throw error;
  }

  async update(tag: Tag): Promise<void> {
    const { error } = await this.supabase
      .from('tags')
      .update({
        name: tag.name,
        color: tag.color,
        updated_at: tag.updatedAt.toISOString(),
      })
      .eq('id', tag.id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async attachToNote(noteId: string, tagId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('note_tags')
      .insert({
        note_id: noteId,
        tag_id: tagId,
        user_id: userId,
      });

    if (error) throw error;
  }

  async detachFromNote(noteId: string, tagId: string): Promise<void> {
    const { error } = await this.supabase
      .from('note_tags')
      .delete()
      .eq('note_id', noteId)
      .eq('tag_id', tagId);

    if (error) throw error;
  }

  async findNoteIdsByTagId(tagId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('note_tags')
      .select('note_id')
      .eq('tag_id', tagId);

    if (error || !data) return [];
    return data.map(item => item.note_id);
  }

  async countByUserId(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('tags')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  }

  private mapToEntity(data: any): Tag {
    return new Tag({
      id: data.id,
      userId: data.user_id,
      name: data.name,
      color: data.color,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }
}
