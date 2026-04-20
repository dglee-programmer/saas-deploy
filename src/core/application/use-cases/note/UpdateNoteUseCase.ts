import { NoteRepository } from '@/core/application/interfaces/NoteRepository';
import { Note } from '@/core/domain/entities/Note';

export interface UpdateNoteDto {
  id: string;
  title?: string;
  content?: string;
  folderId?: string;
}

export class UpdateNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(dto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.findById(dto.id);
    if (!note) {
      throw new Error('Note not found');
    }

    // Manual update for properties (simplified for green phase)
    if (dto.title !== undefined) {
      (note as any).props.title = dto.title;
    }
    if (dto.content !== undefined) {
      note.updateContent(dto.content);
    }
    if (dto.folderId !== undefined) {
      (note as any).props.folderId = dto.folderId;
    }

    await this.noteRepository.update(note);
    return note;
  }
}
