import { Tag } from '@/core/domain/entities/Tag';
import { TagRepository } from '@/core/application/interfaces/TagRepository';

export interface UpdateTagDto {
  id: string;
  name?: string;
  color?: string;
}

export class UpdateTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findById(dto.id);
    if (!tag) {
      throw new Error('태그를 찾을 수 없습니다.');
    }

    if (dto.name !== undefined) {
      tag.rename(dto.name);
    }
    if (dto.color !== undefined) {
      tag.changeColor(dto.color);
    }

    await this.tagRepository.update(tag);
    return tag;
  }
}
