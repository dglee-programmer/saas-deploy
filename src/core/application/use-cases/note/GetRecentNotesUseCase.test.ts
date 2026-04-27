import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetRecentNotesUseCase } from './GetRecentNotesUseCase';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

describe('GetRecentNotesUseCase', () => {
  let noteRepository: NoteRepository;
  let useCase: GetRecentNotesUseCase;

  beforeEach(() => {
    noteRepository = {
      findRecentByUserId: vi.fn(),
    } as any;
    useCase = new GetRecentNotesUseCase(noteRepository);
  });

  it('should return recent notes for a user', async () => {
    const mockNotes = [
      new Note({ id: '1', userId: 'user-1', title: 'Note 1', content: '...', wordCount: 0, tags: [], isPinned: false, isShared: false, createdAt: new Date(), updatedAt: new Date() }),
      new Note({ id: '2', userId: 'user-1', title: 'Note 2', content: '...', wordCount: 0, tags: [], isPinned: false, isShared: false, createdAt: new Date(), updatedAt: new Date() }),
    ];
    (noteRepository.findRecentByUserId as any).mockResolvedValue(mockNotes);

    const result = await useCase.execute({ userId: 'user-1', limit: 5 });

    expect(noteRepository.findRecentByUserId).toHaveBeenCalledWith('user-1', 5);
    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Note 1');
  });
});
