import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateNoteUseCase } from './CreateNoteUseCase';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';

describe('CreateNoteUseCase', () => {
  let noteRepository: NoteRepository;
  let useCase: CreateNoteUseCase;

  beforeEach(() => {
    noteRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findRecentByUserId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any;
    useCase = new CreateNoteUseCase(noteRepository);
  });

  it('should create a new note', async () => {
    const dto = {
      userId: 'user-1',
      title: 'My New Note',
      content: 'Note content',
      folderId: 'folder-1'
    };

    const result = await useCase.execute(dto);

    expect(noteRepository.create).toHaveBeenCalled();
    expect(result.title).toBe('My New Note');
    expect(result.userId).toBe('user-1');
  });
});
