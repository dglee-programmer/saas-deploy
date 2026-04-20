import { FolderRepository } from '@/core/application/interfaces/FolderRepository';
import { Folder } from '@/core/domain/entities/Folder';

export interface GetFoldersDto {
  userId: string;
}

export class GetFoldersUseCase {
  constructor(private folderRepository: FolderRepository) {}

  async execute(dto: GetFoldersDto): Promise<Folder[]> {
    return this.folderRepository.findByUserId(dto.userId);
  }
}
