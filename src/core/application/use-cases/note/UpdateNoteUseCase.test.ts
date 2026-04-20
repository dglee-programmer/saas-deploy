import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateNoteUseCase } from './UpdateNoteUseCase';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

describe('UpdateNoteUseCase', () => {
  let noteRepository: NoteRepository;
  let useCase: UpdateNoteUseCase;

  beforeEach(() => {
    noteRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    } as any;
    useCase = new UpdateNoteUseCase(noteRepository);
  });

  it('should update an existing note', async () => {
    const existingNote = new Note({ id: '1', userId: 'user-1', title: 'Old Title', content: 'Old Content', wordCount: 2, tags: [], isShared: false, createdAt: new Date(), updatedAt: new Date() });
    (noteRepository.findById as any).mockResolvedValue(existingNote);

    const dto = {
      id: '1',
      title: 'New Title',
      content: 'New content updated'
    };

    const result = await useCase.execute(dto);

    expect(noteRepository.update).toHaveBeenCalled();
    expect(result.title).toBe('New Title');
    expect(result.content).toBe('New content updated');
    expect(result.wordCount).toBe(3);
  });

  it('should throw error if note not found', async () => {
    (noteRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute({ id: '999', title: '...', content: '...' }))
      .rejects.toThrow('Note not found');
  });
});
