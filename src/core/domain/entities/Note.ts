export interface NoteProps {
  id: string;
  userId: string;
  folderId?: string;
  title: string;
  content: string;
  wordCount: number;
  tags: string[];
  isPinned: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Note {
  private props: NoteProps;

  constructor(props: NoteProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get folderId(): string | undefined { return this.props.folderId; }
  get title(): string { return this.props.title; }
  get content(): string { return this.props.content; }
  get wordCount(): number { return this.props.wordCount; }
  get tags(): string[] { return this.props.tags; }
  get isPinned(): boolean { return this.props.isPinned; }
  get isShared(): boolean { return this.props.isShared; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  togglePin(): void {
    this.props.isPinned = !this.props.isPinned;
    this.props.updatedAt = new Date();
  }

  updateContent(newContent: string): void {
    this.props.content = newContent;
    this.props.wordCount = this.calculateWordCount(newContent);
    this.props.updatedAt = new Date();
  }

  private calculateWordCount(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }
}
