import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

export interface GetRecentNotesDto {
  userId: string;
  limit: number;
}

export class GetRecentNotesUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(dto: GetRecentNotesDto): Promise<Note[]> {
    return this.noteRepository.findRecentByUserId(dto.userId, dto.limit);
  }
}
