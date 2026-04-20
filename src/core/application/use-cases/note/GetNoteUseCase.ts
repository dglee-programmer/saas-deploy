import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

export interface GetNoteDto {
  id: string;
}

export class GetNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(dto: GetNoteDto): Promise<Note | null> {
    return this.noteRepository.findById(dto.id);
  }
}
