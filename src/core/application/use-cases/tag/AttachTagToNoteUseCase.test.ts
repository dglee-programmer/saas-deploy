import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttachTagToNoteUseCase } from './AttachTagToNoteUseCase';
import { TagRepository } from '@/core/application/interfaces/TagRepository';
import { Tag } from '@/core/domain/entities/Tag';

describe('AttachTagToNoteUseCase', () => {
  let tagRepository: TagRepository;
  let useCase: AttachTagToNoteUseCase;

  beforeEach(() => {
    tagRepository = {
      findByNoteId: vi.fn(),
      attachToNote: vi.fn(),
    } as any;
    useCase = new AttachTagToNoteUseCase(tagRepository);
  });

  it('노트에 태그를 연결한다', async () => {
    (tagRepository.findByNoteId as any).mockResolvedValue([]);
    
    const dto = {
      noteId: 'note-1',
      tagId: 'tag-1',
      userId: 'user-1'
    };

    await useCase.execute(dto);

    expect(tagRepository.attachToNote).toHaveBeenCalledWith('note-1', 'tag-1', 'user-1');
  });

  it('이미 연결된 태그면 다시 연결하지 않는다', async () => {
    const existingTag = new Tag({
      id: 'tag-1',
      userId: 'user-1',
      name: 'Work',
      color: 'blue',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    (tagRepository.findByNoteId as any).mockResolvedValue([existingTag]);

    const dto = {
      noteId: 'note-1',
      tagId: 'tag-1',
      userId: 'user-1'
    };

    await useCase.execute(dto);

    expect(tagRepository.attachToNote).not.toHaveBeenCalled();
  });

  it('태그가 5개를 초과하면 에러를 던진다', async () => {
    const existingTags = Array(5).fill(null).map((_, i) => new Tag({
      id: `tag-${i}`,
      userId: 'user-1',
      name: `Tag ${i}`,
      color: 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    (tagRepository.findByNoteId as any).mockResolvedValue(existingTags);

    const dto = {
      noteId: 'note-1',
      tagId: 'new-tag',
      userId: 'user-1'
    };

    await expect(useCase.execute(dto))
      .rejects.toThrow('한 메모에는 최대 5개의 태그만 달 수 있습니다.');
  });
});
