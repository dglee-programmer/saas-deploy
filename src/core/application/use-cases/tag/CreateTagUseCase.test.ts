import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTagUseCase } from './CreateTagUseCase';
import { TagRepository } from '@/core/application/interfaces/TagRepository';
import { Tag } from '@/core/domain/entities/Tag';

describe('CreateTagUseCase', () => {
  let tagRepository: TagRepository;
  let useCase: CreateTagUseCase;

  beforeEach(() => {
    tagRepository = {
      findByName: vi.fn(),
      create: vi.fn(),
    } as any;
    useCase = new CreateTagUseCase(tagRepository);
  });

  it('사용자가 새 태그를 생성한다', async () => {
    (tagRepository.findByName as any).mockResolvedValue(null);
    
    const dto = {
      userId: 'user-1',
      name: 'Work',
      color: 'blue'
    };

    const result = await useCase.execute(dto);

    expect(tagRepository.create).toHaveBeenCalled();
    expect(result.name).toBe('Work');
    expect(result.color).toBe('blue');
    expect(result.userId).toBe('user-1');
  });

  it('이미 존재하는 이름의 태그면 기존 태그를 반환한다', async () => {
    const existingTag = new Tag({
      id: 'tag-1',
      userId: 'user-1',
      name: 'Work',
      color: 'red',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    (tagRepository.findByName as any).mockResolvedValue(existingTag);

    const dto = {
      userId: 'user-1',
      name: 'Work'
    };

    const result = await useCase.execute(dto);

    expect(tagRepository.create).not.toHaveBeenCalled();
    expect(result.id).toBe('tag-1');
    expect(result.color).toBe('red'); // 기존 색상 유지
  });

  it('태그 이름이 없으면 에러를 던진다', async () => {
    await expect(useCase.execute({ userId: 'user-1', name: '' }))
      .rejects.toThrow('태그 이름은 비어있을 수 없습니다.');
  });

  it('태그 이름이 너무 길면 에러를 던진다', async () => {
    const longName = 'a'.repeat(21);
    await expect(useCase.execute({ userId: 'user-1', name: longName }))
      .rejects.toThrow('태그 이름은 20자를 초과할 수 없습니다.');
  });
});
