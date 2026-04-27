import { Note } from '@/core/domain/entities/Note';
import { NoteRepository } from '@/core/application/interfaces/NoteRepository';

export interface CreateNoteDto {
  userId: string;
  title: string;
  content: string;
  folderId?: string;
}

export class CreateNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(dto: CreateNoteDto): Promise<Note> {
    const now = new Date();
    const note = new Note({
      id: crypto.randomUUID(),
      userId: dto.userId,
      folderId: dto.folderId,
      title: dto.title,
      content: dto.content,
      wordCount: this.calculateWordCount(dto.content),
      tags: [],
      isPinned: false,
      isShared: false,
      createdAt: now,
      updatedAt: now,
    });

    await this.noteRepository.create(note);
    return note;
  }

  private calculateWordCount(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }
}
