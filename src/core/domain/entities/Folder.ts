export interface FolderProps {
  id: string;
  userId: string;
  name: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Folder {
  private props: FolderProps;

  constructor(props: FolderProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get name(): string { return this.props.name; }
  get isPinned(): boolean { return this.props.isPinned; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  rename(newName: string): void {
    this.props.name = newName;
    this.props.updatedAt = new Date();
  }

  togglePin(): void {
    this.props.isPinned = !this.props.isPinned;
    this.props.updatedAt = new Date();
  }
}
