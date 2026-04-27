import { TagRepository } from '@/core/application/interfaces/TagRepository';

export interface DeleteTagDto {
  id: string;
}

export class DeleteTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(dto: DeleteTagDto): Promise<void> {
    const tag = await this.tagRepository.findById(dto.id);
    if (!tag) {
      throw new Error('태그를 찾을 수 없습니다.');
    }

    await this.tagRepository.delete(dto.id);
  }
}
