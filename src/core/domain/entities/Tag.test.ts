import { describe, it, expect } from 'vitest';
import { Tag } from './Tag';

describe('Tag Entity', () => {
  const validProps = {
    id: 'tag-1',
    userId: 'user-1',
    name: 'TypeScript',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('유효한 프로퍼티로 태그를 생성할 수 있다', () => {
    const tag = new Tag(validProps);
    expect(tag.id).toBe(validProps.id);
    expect(tag.name).toBe(validProps.name);
  });

  it('비어있는 이름으로 태그를 생성할 수 없다', () => {
    expect(() => new Tag({ ...validProps, name: '' })).toThrow('태그 이름은 비어있을 수 없습니다.');
    expect(() => new Tag({ ...validProps, name: '   ' })).toThrow('태그 이름은 비어있을 수 없습니다.');
  });

  it('20자를 초과하는 이름으로 태그를 생성할 수 없다', () => {
    expect(() => new Tag({ ...validProps, name: 'a'.repeat(21) })).toThrow('태그 이름은 20자를 초과할 수 없습니다.');
  });

  it('태그 이름을 변경할 수 있다', () => {
    const tag = new Tag(validProps);
    tag.rename('JavaScript');
    expect(tag.name).toBe('JavaScript');
  });

  it('태그 색상을 변경할 수 있다', () => {
    const tag = new Tag(validProps);
    tag.changeColor('red');
    expect(tag.color).toBe('red');
  });
});
