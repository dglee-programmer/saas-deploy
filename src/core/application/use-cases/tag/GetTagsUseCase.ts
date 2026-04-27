import { Tag } from '@/core/domain/entities/Tag';
import { TagRepository } from '@/core/application/interfaces/TagRepository';

export interface GetTagsDto {
  userId: string;
}

export class GetTagsUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(dto: GetTagsDto): Promise<Tag[]> {
    return await this.tagRepository.findByUserId(dto.userId);
  }
}
