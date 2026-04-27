export interface TagProps {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Tag {
  private props: TagProps;

  constructor(props: TagProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: TagProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('태그 이름은 비어있을 수 없습니다.');
    }
    if (props.name.length > 20) {
      throw new Error('태그 이름은 20자를 초과할 수 없습니다.');
    }
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get name(): string { return this.props.name; }
  get color(): string { return this.props.color; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  rename(newName: string): void {
    const oldName = this.props.name;
    this.props.name = newName;
    try {
      this.validate(this.props);
      this.props.updatedAt = new Date();
    } catch (error) {
      this.props.name = oldName;
      throw error;
    }
  }

  changeColor(newColor: string): void {
    this.props.color = newColor;
    this.props.updatedAt = new Date();
  }
}
