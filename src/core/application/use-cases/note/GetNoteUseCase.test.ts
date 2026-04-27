import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNoteUseCase } from './GetNoteUseCase';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

describe('GetNoteUseCase', () => {
  let noteRepository: NoteRepository;
  let useCase: GetNoteUseCase;

  beforeEach(() => {
    noteRepository = {
      findById: vi.fn(),
    } as any;
    useCase = new GetNoteUseCase(noteRepository);
  });

  it('should return a note by its id', async () => {
    const mockNote = new Note({ id: '1', userId: 'user-1', title: 'Note 1', content: '...', wordCount: 0, tags: [], isPinned: false, isShared: false, createdAt: new Date(), updatedAt: new Date() });
    (noteRepository.findById as any).mockResolvedValue(mockNote);

    const result = await useCase.execute({ id: '1' });

    expect(noteRepository.findById).toHaveBeenCalledWith('1');
    expect(result?.title).toBe('Note 1');
  });

  it('should return null if note not found', async () => {
    (noteRepository.findById as any).mockResolvedValue(null);

    const result = await useCase.execute({ id: '999' });

    expect(result).toBeNull();
  });
});
