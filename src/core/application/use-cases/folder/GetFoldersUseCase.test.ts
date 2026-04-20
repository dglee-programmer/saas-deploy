import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetFoldersUseCase } from './GetFoldersUseCase';
import { FolderRepository } from '@/core/application/interfaces/FolderRepository';
import { Folder } from '@/core/domain/entities/Folder';

describe('GetFoldersUseCase', () => {
  let folderRepository: FolderRepository;
  let useCase: GetFoldersUseCase;

  beforeEach(() => {
    folderRepository = {
      findByUserId: vi.fn(),
    } as any;
    useCase = new GetFoldersUseCase(folderRepository);
  });

  it('should return folders for a user', async () => {
    const mockFolders = [
      new Folder({ id: 'f-1', userId: 'user-1', name: 'Work', isPinned: true, createdAt: new Date(), updatedAt: new Date() }),
    ];
    (folderRepository.findByUserId as any).mockResolvedValue(mockFolders);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(folderRepository.findByUserId).toHaveBeenCalledWith('user-1');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Work');
  });
});
