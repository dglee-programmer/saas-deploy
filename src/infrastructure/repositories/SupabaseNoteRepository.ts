import { Note } from '@/core/domain/entities/Note';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseNoteRepository implements NoteRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<Note | null> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapToEntity);
  }

  async findRecentByUserId(userId: string, limit: number): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map(this.mapToEntity);
  }

  async searchByUserId(userId: string, query: string): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapToEntity);
  }

  async create(note: Note): Promise<void> {
    const { error } = await this.supabase
      .from('notes')
      .insert({
        id: note.id,
        user_id: note.userId,
        folder_id: note.folderId,
        title: note.title,
        content: note.content,
        word_count: note.wordCount,
        tags: note.tags,
        is_shared: note.isShared,
        created_at: note.createdAt.toISOString(),
        updated_at: note.updatedAt.toISOString(),
      });

    if (error) throw error;
  }

  async update(note: Note): Promise<void> {
    const { error } = await this.supabase
      .from('notes')
      .update({
        folder_id: note.folderId,
        title: note.title,
        content: note.content,
        word_count: note.wordCount,
        tags: note.tags,
        is_shared: note.isShared,
        updated_at: note.updatedAt.toISOString(),
      })
      .eq('id', note.id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async countByUserId(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  }

  private mapToEntity(data: any): Note {
    return new Note({
      id: data.id,
      userId: data.user_id,
      folderId: data.folder_id,
      title: data.title,
      content: data.content,
      wordCount: data.word_count,
      tags: data.tags,
      isShared: data.is_shared,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }
}
