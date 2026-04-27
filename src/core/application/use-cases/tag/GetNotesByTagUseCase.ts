import { TagRepository } from '@/core/application/interfaces/TagRepository';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

export interface GetNotesByTagDto {
  tagId: string;
}

export class GetNotesByTagUseCase {
  constructor(
    private tagRepository: TagRepository,
    private noteRepository: NoteRepository
  ) {}

  async execute(dto: GetNotesByTagDto): Promise<Note[]> {
    const noteIds = await this.tagRepository.findNoteIdsByTagId(dto.tagId);
    
    // 이 방식은 비효율적일 수 있으나 아키텍처 원칙에 따라 인터페이스를 사용
    // 실제 구현체(Infrastructure)에서는 JOIN 쿼리를 사용하는 것이 더 좋음
    const notes = await Promise.all(
      noteIds.map(id => this.noteRepository.findById(id))
    );

    return notes.filter((n): n is Note => n !== null);
  }
}
