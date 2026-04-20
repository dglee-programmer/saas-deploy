import { Folder } from '@/core/domain/entities/Folder';

export interface FolderRepository {
  findByUserId(userId: string): Promise<Folder[]>;
  create(folder: Folder): Promise<void>;
  update(folder: Folder): Promise<void>;
  delete(id: string): Promise<void>;
}
