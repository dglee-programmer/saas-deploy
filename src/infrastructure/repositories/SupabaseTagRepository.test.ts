import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseTagRepository } from './SupabaseTagRepository';
import { Tag } from '@/core/domain/entities/Tag';

describe('SupabaseTagRepository', () => {
  let mockSupabase: any;
  let repository: SupabaseTagRepository;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
    };
    repository = new SupabaseTagRepository(mockSupabase);
  });

  it('findById는 태그 정보를 올바르게 가져와서 엔티티로 변환한다', async () => {
    const mockData = {
      id: 'tag-1',
      user_id: 'user-1',
      name: 'Work',
      color: 'blue',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockSupabase.maybeSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await repository.findById('tag-1');

    expect(mockSupabase.from).toHaveBeenCalledWith('tags');
    expect(result).toBeInstanceOf(Tag);
    expect(result?.name).toBe('Work');
  });

  it('findByUserId는 사용자의 모든 태그를 가져온다', async () => {
    const mockData = [
      { id: '1', user_id: 'u1', name: 'T1', color: 'c1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '2', user_id: 'u1', name: 'T2', color: 'c2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    mockSupabase.maybeSingle = undefined; // findByUserId uses default promise result
    mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

    const result = await repository.findByUserId('u1');

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('T1');
  });

  it('create는 태그 정보를 올바르게 저장한다', async () => {
    const tag = new Tag({
      id: 'tag-1',
      userId: 'user-1',
      name: 'Work',
      color: 'blue',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    mockSupabase.insert.mockResolvedValue({ error: null });

    await repository.create(tag);

    expect(mockSupabase.from).toHaveBeenCalledWith('tags');
    expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Work',
      color: 'blue'
    }));
  });

  it('attachToNote는 note_tags 테이블에 연결 정보를 저장한다', async () => {
    mockSupabase.insert.mockResolvedValue({ error: null });

    await repository.attachToNote('note-1', 'tag-1', 'user-1');

    expect(mockSupabase.from).toHaveBeenCalledWith('note_tags');
    expect(mockSupabase.insert).toHaveBeenCalledWith({
      note_id: 'note-1',
      tag_id: 'tag-1',
      user_id: 'user-1'
    });
  });
});
