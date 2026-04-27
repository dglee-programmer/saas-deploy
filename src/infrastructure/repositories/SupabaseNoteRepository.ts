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
      .maybeSingle();

    if (error) {
      console.error('[SupabaseNoteRepository] findById error:', error);
      throw error;
    }
    if (!data) return null;

    // 1. note_tags에서 tag_id 목록 가져오기
    const { data: noteTags, error: ntError } = await this.supabase
      .from('note_tags')
      .select('tag_id')
      .eq('note_id', id);

    if (ntError) {
      console.error('[SupabaseNoteRepository] note_tags fetch error:', ntError);
      return this.mapToEntity({ ...data, tags: [] }); // 태그 조회 실패 시 태그 없이 반환
    }

    // 2. tag_id들로 tags 테이블에서 이름 가져오기
    let tagNames: string[] = [];
    if (noteTags && noteTags.length > 0) {
      const tagIds = noteTags.map(nt => nt.tag_id);
      const { data: tags, error: tError } = await this.supabase
        .from('tags')
        .select('name')
        .in('id', tagIds);
      
      if (tError) {
        console.error('[SupabaseNoteRepository] tags fetch error:', tError);
      } else {
        tagNames = tags?.map(t => t.name) || [];
      }
    }

    return this.mapToEntity({ 
      ...data, 
      tags: tagNames 
    });
  }

  private async getNotesWithTags(notesData: any[]): Promise<Note[]> {
    if (!notesData || notesData.length === 0) return [];

    const noteIds = notesData.map(n => n.id);

    // 1. note_tags 일괄 조회 (Join 없이)
    const { data: noteTags } = await this.supabase
      .from('note_tags')
      .select('note_id, tag_id')
      .in('note_id', noteIds);

    if (!noteTags || noteTags.length === 0) {
      return notesData.map((item: any) => this.mapToEntity({ ...item, tags: [] }));
    }

    // 2. tags 일괄 조회
    const tagIds = [...new Set(noteTags.map(nt => nt.tag_id))];
    const { data: tags } = await this.supabase
      .from('tags')
      .select('id, name')
      .in('id', tagIds);

    const tagMap = new Map(tags?.map(t => [t.id, t.name]) || []);

    // 3. 매핑
    return notesData.map((item: any) => {
      const itemTagIds = noteTags.filter(nt => nt.note_id === item.id).map(nt => nt.tag_id);
      const itemTagNames = itemTagIds.map(id => tagMap.get(id)).filter(Boolean) as string[];
      return this.mapToEntity({ ...item, tags: itemTagNames });
    });
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return this.getNotesWithTags(data);
  }

  async findRecentByUserId(userId: string, limit: number): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return this.getNotesWithTags(data);
  }

  async searchByUserId(userId: string, query: string): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return this.getNotesWithTags(data);
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
        // tags: note.tags, // 이제 테이블로 관리하므로 제거하거나 빈 배열로 유지
        is_pinned: note.isPinned,
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
        // tags: note.tags, // 이제 테이블로 관리하므로 제거
        is_pinned: note.isPinned,
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
    // 1. 이미 처리된 tags 배열이 있으면 사용
    // 2. 그렇지 않으면 note_tags에서 추출 시도
    // 3. 마지막으로 기존 TEXT[] 컬럼 tags 사용
    let tags: string[] = [];
    if (Array.isArray(data.tags) && typeof data.tags[0] === 'string') {
      tags = data.tags;
    } else if (data.note_tags) {
      tags = data.note_tags
        .filter((nt: any) => nt.tags)
        .map((nt: any) => nt.tags.name);
    } else {
      tags = data.tags || [];
    }

    return new Note({
      id: data.id,
      userId: data.user_id,
      folderId: data.folder_id,
      title: data.title,
      content: data.content,
      wordCount: data.word_count,
      tags: tags,
      isPinned: data.is_pinned ?? false,
      isShared: data.is_shared,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }
}
