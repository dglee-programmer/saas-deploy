import { Tag } from '@/core/domain/entities/Tag';
import { TagRepository } from '@/core/application/interfaces/TagRepository';

export interface CreateTagDto {
  userId: string;
  name: string;
  color?: string;
}

export class CreateTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(dto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.tagRepository.findByName(dto.userId, dto.name);
    if (existingTag) {
      return existingTag; // 이미 존재하는 태그면 그대로 반환
    }

    const now = new Date();
    const tag = new Tag({
      id: crypto.randomUUID(),
      userId: dto.userId,
      name: dto.name,
      color: dto.color || 'default',
      createdAt: now,
      updatedAt: now,
    });

    await this.tagRepository.create(tag);
    return tag;
  }
}
