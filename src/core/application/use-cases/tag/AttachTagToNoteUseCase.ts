import { TagRepository } from '@/core/application/interfaces/TagRepository';

export interface AttachTagToNoteDto {
  noteId: string;
  tagId: string;
  userId: string;
}

export class AttachTagToNoteUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(dto: AttachTagToNoteDto): Promise<void> {
    // 이미 연결되어 있는지 확인 (중복 연결 방지는 레포지토리 레벨 또는 DB 제약조건에서 처리 가능하지만 명시적으로 처리)
    const existingTags = await this.tagRepository.findByNoteId(dto.noteId);
    if (existingTags.some(t => t.id === dto.tagId)) {
      return;
    }

    // 최대 개수 제한 (5개)
    if (existingTags.length >= 5) {
      throw new Error('한 메모에는 최대 5개의 태그만 달 수 있습니다.');
    }

    await this.tagRepository.attachToNote(dto.noteId, dto.tagId, dto.userId);
  }
}
