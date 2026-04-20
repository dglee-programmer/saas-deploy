import { Note } from '@/core/domain/entities/Note';

export interface NoteRepository {
  findById(id: string): Promise<Note | null>;
  findByUserId(userId: string): Promise<Note[]>;
  findRecentByUserId(userId: string, limit: number): Promise<Note[]>;
  searchByUserId(userId: string, query: string): Promise<Note[]>;
  create(note: Note): Promise<void>;
  update(note: Note): Promise<void>;
  delete(id: string): Promise<void>;
}
