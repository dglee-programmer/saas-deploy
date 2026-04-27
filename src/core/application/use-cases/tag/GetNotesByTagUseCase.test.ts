import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNotesByTagUseCase } from './GetNotesByTagUseCase';
import { TagRepository } from '@/core/application/interfaces/TagRepository';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

describe('GetNotesByTagUseCase', () => {
  let tagRepository: TagRepository;
  let noteRepository: NoteRepository;
  let useCase: GetNotesByTagUseCase;

  beforeEach(() => {
    tagRepository = {
      findNoteIdsByTagId: vi.fn(),
    } as any;
    noteRepository = {
      findById: vi.fn(),
    } as any;
    useCase = new GetNotesByTagUseCase(tagRepository, noteRepository);
  });

  it('특정 태그가 달린 노트 목록을 가져온다', async () => {
    (tagRepository.findNoteIdsByTagId as any).mockResolvedValue(['note-1', 'note-2']);
    
    const note1 = new Note({ id: 'note-1', userId: 'user-1', title: 'Note 1', content: '', wordCount: 0, tags: ['Work'], isPinned: false, isShared: false, createdAt: new Date(), updatedAt: new Date() });
    const note2 = new Note({ id: 'note-2', userId: 'user-1', title: 'Note 2', content: '', wordCount: 0, tags: ['Work'], isPinned: false, isShared: false, createdAt: new Date(), updatedAt: new Date() });
    
    (noteRepository.findById as any)
      .mockResolvedValueOnce(note1)
      .mockResolvedValueOnce(note2);

    const result = await useCase.execute({ tagId: 'tag-1' });

    expect(result.length).toBe(2);
    expect(result[0].id).toBe('note-1');
    expect(result[1].id).toBe('note-2');
  });

  it('연결된 노트가 없으면 빈 배열을 반환한다', async () => {
    (tagRepository.findNoteIdsByTagId as any).mockResolvedValue([]);
    
    const result = await useCase.execute({ tagId: 'tag-1' });

    expect(result).toEqual([]);
    expect(noteRepository.findById).not.toHaveBeenCalled();
  });
});
