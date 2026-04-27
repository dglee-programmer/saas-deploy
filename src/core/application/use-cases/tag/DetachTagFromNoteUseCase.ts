import { TagRepository } from '@/core/application/interfaces/TagRepository';

export interface DetachTagFromNoteDto {
  noteId: string;
  tagId: string;
}

export class DetachTagFromNoteUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(dto: DetachTagFromNoteDto): Promise<void> {
    await this.tagRepository.detachFromNote(dto.noteId, dto.tagId);
  }
}
