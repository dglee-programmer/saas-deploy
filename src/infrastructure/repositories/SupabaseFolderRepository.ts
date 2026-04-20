import { Folder } from '@/core/domain/entities/Folder';
import { FolderRepository } from '@/core/application/interfaces/FolderRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseFolderRepository implements FolderRepository {
  constructor(private supabase: SupabaseClient) {}

  async findByUserId(userId: string): Promise<Folder[]> {
    const { data, error } = await this.supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('is_pinned', { ascending: false })
      .order('name', { ascending: true });

    if (error || !data) return [];
    return data.map(this.mapToEntity);
  }

  async create(folder: Folder): Promise<void> {
    const { error } = await this.supabase
      .from('folders')
      .insert({
        id: folder.id,
        user_id: folder.userId,
        name: folder.name,
        is_pinned: folder.isPinned,
        created_at: folder.createdAt.toISOString(),
        updated_at: folder.updatedAt.toISOString(),
      });

    if (error) throw error;
  }

  async update(folder: Folder): Promise<void> {
    const { error } = await this.supabase
      .from('folders')
      .update({
        name: folder.name,
        is_pinned: folder.isPinned,
        updated_at: folder.updatedAt.toISOString(),
      })
      .eq('id', folder.id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapToEntity(data: any): Folder {
    return new Folder({
      id: data.id,
      userId: data.user_id,
      name: data.name,
      isPinned: data.is_pinned,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }
}
