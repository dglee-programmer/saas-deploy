import { Tag } from '@/core/domain/entities/Tag';

export interface TagRepository {
  findById(id: string): Promise<Tag | null>;
  findByUserId(userId: string): Promise<Tag[]>;
  findByNoteId(noteId: string): Promise<Tag[]>;
  findByName(userId: string, name: string): Promise<Tag | null>;
  create(tag: Tag): Promise<void>;
  update(tag: Tag): Promise<void>;
  delete(id: string): Promise<void>;
  attachToNote(noteId: string, tagId: string, userId: string): Promise<void>;
  detachFromNote(noteId: string, tagId: string): Promise<void>;
  findNoteIdsByTagId(tagId: string): Promise<string[]>;
  countByUserId(userId: string): Promise<number>;
}
